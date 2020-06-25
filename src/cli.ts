import { FileDefinition } from './definition'
import { toTypescriptDefinition } from './typescript'
import { toJsonSchema } from './schema'
import { template } from './template'
import { notEmpty } from './util'
import { ArrayType, DictType, ObjectType, ThereforeTypes, TupleType } from './types/composite'
import { schema } from './therefore'
import { EnumType } from './types/enum'

import decamelize from 'decamelize'
import execa from 'execa'
import fastGlob from 'fast-glob'

import path from 'path'
import fs from 'fs'

export function isEnum(obj: ThereforeTypes | { [schema.type]: string }): obj is EnumType {
    return obj[schema.type] === 'enum'
}

export function isObject(obj: ThereforeTypes | { [schema.type]: string }): obj is ObjectType {
    return obj[schema.type] === 'object'
}

export function isDict(obj: ThereforeTypes | { [schema.type]: string }): obj is DictType {
    return obj[schema.type] === 'dict'
}

export function isArray(obj: ThereforeTypes | { [schema.type]: string }): obj is ArrayType {
    return obj[schema.type] === 'array'
}

export function isTuple(obj: ThereforeTypes | { [schema.type]: string }): obj is TupleType {
    return obj[schema.type] === 'tuple'
}

// export function isRef(obj: ThereforeTypes): obj is RefType {
//     return obj[schema.type] === '$ref'
// }

export function isShorthand(obj: unknown | ThereforeTypes | { [schema.type]: string }): obj is ThereforeTypes {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    return (obj as any)[schema.type] !== undefined
}

export function isExportable(obj: unknown | ThereforeTypes): obj is TupleType | DictType | ObjectType | EnumType {
    return isShorthand(obj) && (isTuple(obj) || isDict(obj) || isObject(obj) || isEnum(obj))
}

export function getSchemaFilename(file: string, extension: string): string {
    return `${file.replace('.ts', '')}${extension}`
}

export function requireReference(
    definitions: Record<string, FileDefinition>,
    uuid: string
): { file: string; type: string; uuid: string; reference: string } {
    const reference = Object.values(definitions)
        .map((d) =>
            d.symbols.map((i) => ({
                file: d.file,
                interface: i.tsDefinition.uuid === uuid ? i.tsDefinition : undefined,
            }))
        )
        .flat()
        .filter((x) => x.interface !== undefined)
    return {
        file: reference[0]!.file,
        type: reference[0]!.interface!.interfaceName,
        reference: reference[0]!.interface!.referenceName,
        uuid,
    }
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const requireFunc = typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require
export function scanModule(entry: string, definitions: { [k: string]: FileDefinition }, fullPath: string): void {
    const definition: FileDefinition = {
        file: fullPath,
        jsonSchemaFiles: [],
        symbols: [],
        dependencies: {},
    }
    const relative = path.relative(__dirname, entry).replace(/\\/g, '/')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const module = requireFunc(relative.startsWith('.') ? relative : `./${relative}`)
    for (const [name, symbol] of Object.entries(module)) {
        if (isExportable(symbol)) {
            const schemaName = decamelize(name, '-')
            const schemaFile = `./schemas/${schemaName}.schema.json`
            const schema = toJsonSchema(symbol)

            const tsDefinition = toTypescriptDefinition(name, symbol)
            definition.symbols.push({ name, root: path.dirname(entry), schema, tsDefinition: tsDefinition, schemaFile })

            if (tsDefinition.meta) {
                const jsonSchemaFile = path.join(path.dirname(entry), schemaFile)
                fs.mkdirSync(path.join(path.dirname(entry), 'schemas'), { recursive: true })
                fs.writeFileSync(jsonSchemaFile, JSON.stringify(schema.schema, null, 2))
                definition.jsonSchemaFiles.push(jsonSchemaFile)
            }

            console.log(` - found ${tsDefinition.interfaceName}`)
        }
        if (definition.symbols.length) {
            definitions[fullPath] = definition
        }
    }
}

export function scanFiles(files: string[], basePath: string): { [k: string]: FileDefinition } {
    const definitions: {
        [k: string]: FileDefinition
    } = {}
    for (const entry of files) {
        const fullPath = path.resolve(basePath, entry)

        console.log(`scanning ${entry}`)
        try {
            scanModule(entry, definitions, fullPath)
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            console.debug(e.message)
            continue
        }
    }
    return definitions
}

export async function execute({
    globs,
    excludes,
    format,
    extension,
}: {
    globs: string[]
    excludes: string[]
    format: boolean
    extension: string
}): Promise<void> {
    const entries = await fastGlob([...globs, ...excludes.map((e) => `!${e}`)], { dot: true })

    const definitions = scanFiles(entries, process.cwd())

    const typescriptFiles: string[] = []
    for (const [file, definition] of Object.entries(definitions)) {
        const required = definition.symbols
            .map((i) => i.tsDefinition.references.map((r) => requireReference(definitions, r.uuid)))
            .flat()

        for (const r of required) {
            if (!definition.dependencies[r.file]) {
                definition.dependencies[r.file] = []
            }
            definition.dependencies[r.file].push(r.type)
        }

        const schemaFileName = getSchemaFilename(file, extension)

        const relativeDependencies = Object.entries(definition.dependencies)
            .map(([f, deps]) => ({
                file: getSchemaFilename(f, extension),
                deps: `{ ${[...new Set(deps)].sort().join(', ')} }`,
            }))
            .filter(({ file }) => file !== schemaFileName)
            .map(({ file, deps }) => {
                const otherPath = path.relative(path.dirname(schemaFileName), file).replace('.ts', '').replace(/\\/g, '/')
                return `import ${deps} from '${otherPath.startsWith('.') ? otherPath : `./${otherPath}`}'`
            })

        fs.writeFileSync(
            schemaFileName,
            ([] as string[])
                .concat(
                    ['/* eslint-disable */'],
                    definition.symbols
                        .filter((i) => i.tsDefinition?.meta)
                        .map((i) => `import ${i.name}Schema from '${i.schemaFile}'`)
                        .sort(),
                    relativeDependencies.length ? ['', ...relativeDependencies] : [],
                    ['', `import AjvValidator from 'ajv'`, ''],
                    Object.values(definition.symbols)
                        .map((i) => [
                            template(
                                i.tsDefinition.declaration,
                                Object.fromEntries(required.map((r) => [r.uuid, r.reference] as [string, string]))
                            ),
                            i.tsDefinition.meta
                                ? template(i.tsDefinition.meta, {
                                      schema: `${i.name}Schema`,
                                  })
                                : undefined,
                        ])
                        .flat(2)
                        .filter(notEmpty)
                )
                .join('\n')
        )

        typescriptFiles.push(schemaFileName, ...definition.jsonSchemaFiles)
    }

    if (typescriptFiles.length > 0 && format) {
        execa.commandSync(`yarn prettier --write ${typescriptFiles.map((f) => path.relative(process.cwd(), f)).join(' ')}`, {
            stdio: 'inherit',
        })
    }
}
