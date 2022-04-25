import { generatedBy } from './constants'
import { expandGlobs } from './glob'
import { formatFile, maybeLoadPrettier } from './prettier'
import { requireReference } from './reference'
import type { FileDefinition, ThereforeOutputType } from './types'

import { version } from '../../../package.json'
import { renderTemplate } from '../../common/template/template'
import type { TypescriptDefinition } from '../../definition'
import type { CstNode } from '../../lib/cst/cst'
import { isThereforeExport } from '../../lib/guard'
import type { ThereforeCst } from '../../lib/types/types'
import { prepass, toJsonSchema } from '../../lib/visitor'
import { toTypescriptDefinition, writeThereforeSchema } from '../../lib/visitor/typescript/typescript'

import { evaluate, hasPropertiesDefined, isDefined } from '@zefiros-software/axioms'
import decamelize from 'decamelize'

import fs from 'fs'
import path from 'path'

function requireModule(module: string): Record<string, CstNode | unknown> {
    const relative = path.relative(__dirname, module).replace(/\\/g, '/').replace('.ts', '')

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(relative.startsWith('.') ? relative : `./${relative}`) as Record<string, CstNode | unknown>
}

export function scanModule({
    entry,
    fullPath,
    compile,
    require = requireModule,
}: {
    entry: string
    fullPath: string
    compile: boolean
    require?: (module: string) => Record<string, CstNode | unknown>
}): FileDefinition {
    const file: FileDefinition = {
        file: fullPath,
        attachedFiles: [],
        symbols: [],
        dependencies: {},
    }
    const module = require(entry)

    for (const [sourceSymbol, symbol] of Object.entries(module).filter(([, exports]) => isThereforeExport(exports))) {
        const simplified = prepass(symbol as ThereforeCst)
        const schemaName = decamelize(sourceSymbol, { separator: '-' })
        const schemaFile = `./schemas/${schemaName}.schema.json`
        const compiledFile = `./schemas/${schemaName}.schema.js`

        const jsonschema = toJsonSchema(simplified, compile)
        const definition = toTypescriptDefinition({ sourceSymbol, schema: simplified })

        file.symbols.push(
            ...Object.values(definition.locals ?? {}).map((local) => ({
                symbolName: local.symbolName,
                definition: local,
                typeOnly: true,
            }))
        )

        file.symbols.push({
            symbolName: sourceSymbol,
            definition: definition,
            schemaFile,
            compiledFile,
            typeOnly: false,
        })

        if (definition.isExported) {
            if (jsonschema.compiled === true) {
                const filePath = path.join(path.dirname(entry), compiledFile)
                file.attachedFiles.push({
                    file: filePath,
                    content: `/**\n * ${generatedBy}\n * eslint-disable\n */\n${jsonschema.code}`,
                    prettify: false,
                    type: 'validator',
                })
            } else {
                file.attachedFiles.push({
                    file: path.join(path.dirname(entry), schemaFile),
                    content: JSON.stringify(jsonschema.schema, null, 2),
                    prettify: true,
                    type: 'jsonschema',
                })
            }

            console.debug(` - found ${definition.symbolName}`)
        }
    }
    return file
}

export function scanFiles({
    files,
    basePath,
    compile,
}: {
    files: string[]
    basePath: string
    compile: boolean
}): Record<string, FileDefinition> {
    const definitions: Record<string, FileDefinition> = {}
    for (const entry of files) {
        const fullPath = path.resolve(basePath, entry)
        let isGenerated = false
        const strippedPath = fullPath.substr(0, fullPath.lastIndexOf('.'))
        for (const ext of ['.ts', '.js']) {
            const p = `${strippedPath}${ext}`
            isGenerated ||= fs.existsSync(p) && fs.readFileSync(p).includes(generatedBy)
        }
        if (isGenerated) {
            console.debug(`scanning ${entry}`)
            console.debug(` * skipping generated schema`)
            continue
        }

        console.log(`scanning ${entry}`)
        try {
            const file = scanModule({ entry, fullPath, compile })
            if (file.symbols.length > 0) {
                definitions[fullPath] = file
            }
        } catch (e: unknown) {
            const error = e as Error
            console.debug(error.message, error.stack)
            throw error
        }
    }
    return definitions
}

// eslint-disable-next-line @typescript-eslint/require-await
export async function compileSchemas(
    entries: string[],
    { compile = false, cwd, outputFileRename }: { cwd: string; compile: boolean; outputFileRename: (path: string) => string }
): Promise<
    {
        file: string
        template: string
        data: Record<string, string>
        type: ThereforeOutputType
        prettify: boolean
    }[]
> {
    const schemaFiles: {
        file: string
        relativeSource: string
        template: string
        data: Record<string, string>
        type: ThereforeOutputType
        prettify: boolean
    }[] = []
    const definitions = scanFiles({ files: entries, basePath: cwd, compile })

    const localReferences = {}

    for (const [file, definition] of Object.entries(definitions)) {
        const locals: NonNullable<TypescriptDefinition['locals']> = {}
        const required = definition.symbols
            .flatMap((i) => i.definition.references.map((r) => requireReference(definitions, definition, r, locals)))
            .flat(2)

        definition.symbols.push(
            ...Object.values(locals ?? {}).map((local) => ({
                symbolName: local.sourceSymbol,
                definition: local,
                typeOnly: true,
            }))
        )

        for (const r of required) {
            definition.dependencies[r.file] ??= []
            definition.dependencies[r.file]?.push(r.symbolName)
        }

        const schemaFileName = outputFileRename(file)

        const relativeDependencies = Object.entries(definition.dependencies)
            .map(([f, deps]) => ({
                file: outputFileRename(f),
                deps: `{ ${[...new Set(deps)].sort().join(', ')} }`,
            }))
            .filter(({ file: f }) => f !== schemaFileName)
            .map(({ file: f, deps }) => {
                const otherPath = path.relative(path.dirname(schemaFileName), f).replace('.ts', '').replace(/\\/g, '/')
                return `import ${deps} from '${otherPath.startsWith('.') ? otherPath : `./${otherPath}`}'`
            })

        const references = Object.fromEntries(required.map((r) => [r.uuid, r.referenceName] as const))

        const schemaFile = path.relative(cwd, schemaFileName).replace(/\\/g, '/')
        const relativeSource = `./${path.relative(path.dirname(schemaFile), path.relative(cwd, file)).replace(/\.ts$/g, '')}`
        schemaFiles.push(
            {
                file: schemaFile,
                relativeSource,
                type: 'typescript',
                template: ([] as string[])
                    .concat(
                        ['/**', ` * ${generatedBy}@v${version}`, ' * Do not manually touch this', ' */\n'],
                        ['/* eslint-disable */'],
                        definition.symbols
                            .filter(hasPropertiesDefined(['schemaFile']))
                            .filter((i) => !i.typeOnly && i.compiledFile === undefined)
                            .map((i) => `import ${i.symbolName}Schema from '${i.schemaFile}'`)
                            .sort(),
                        relativeDependencies.length ? ['', ...relativeDependencies] : [],
                        ['', `import type { ValidateFunction } from 'ajv'`, ''],
                        ['', `import AjvValidator from 'ajv'`, ''],
                        Object.values(definition.symbols)
                            .map((i) => [
                                i.definition.declaration,
                                i.definition.isExported && !i.typeOnly
                                    ? writeThereforeSchema({
                                          symbolName: i.definition.referenceName,
                                          schemaReference: `${i.symbolName}Schema`,
                                          validatorFile: i.compiledFile,
                                          source: relativeSource.replace('./', ''),
                                          sourceSymbol: i.definition.sourceSymbol,
                                          description: evaluate(i.definition.schema).description,
                                      })
                                    : undefined,
                            ])
                            .flat(2)
                            .filter(isDefined)
                    )
                    .join('\n'),
                data: { ...localReferences, ...references },
                prettify: true,
            },
            ...definition.attachedFiles.map((j) => ({
                file: path.relative(cwd, j.file).replace(/\\/g, '/'),
                relativeSource,
                type: j.type,
                template: j.content,
                data: { ...localReferences, ...references },
                prettify: j.prettify,
            }))
        )
    }

    return compile ? schemaFiles : schemaFiles.filter((f) => f.type !== 'validator')
}

export async function generate({
    globs,
    ignore,
    extension,
    compile,
    outputFileRename,
}: {
    globs: string[]
    ignore: string[]
    extension: string
    compile: boolean
    outputFileRename: (path: string) => string
}): Promise<void> {
    const cwd = process.cwd()
    const entries = await expandGlobs({ patterns: globs, ignore: [`!${extension}`, ...ignore], cwd, extension })

    const schemaFiles = await compileSchemas(entries, {
        cwd,
        outputFileRename,
        compile,
    })
    const prettier = maybeLoadPrettier()

    for (const { file, template, data, type, prettify } of schemaFiles) {
        fs.mkdirSync(path.dirname(file), { recursive: true })
        const contents = renderTemplate(template, data)
        fs.writeFileSync(file, prettify ? await formatFile(prettier, contents, file, type) : contents)
    }
}
