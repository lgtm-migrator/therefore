import { TypescriptDefinition } from './definition'
import { Json, schema, ThereforeCommon } from './therefore'
import { DictType, ObjectType, ThereforeTypes } from './types/composite'
import { GraphVisitor, walkGraph } from './ast'

import camelCase from 'camelcase'
import CodeBlockWriter from 'code-block-writer'

export interface TypescriptWalkerContext {
    name: string
    references: TypescriptDefinition['references']
}

const createWriter = () =>
    new CodeBlockWriter({
        indentNumberOfSpaces: 4,
        useSingleQuote: true,
    })

export function toLiteral(obj: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const unsupported = (_: any) => {
        throw new Error('not supported')
    }
    const walker = {
        object: (n: Record<string, unknown> | unknown[]): string => {
            if (Array.isArray(n)) {
                return `[${n.map((v) => walker[typeof v](v)).join(', ')}]`
            } else if (n === null) {
                return 'null'
            } else {
                return `{ ${Object.entries(n)
                    .map(([k, v]) => `${k}: ${walker[typeof v](v)}`)
                    .join('; ')} }`
            }
        },
        number: (n: number) => `${n}`,
        bigint: (n: bigint) => `${n}`,
        string: (n: string) => `'${n}'`,
        boolean: (n: boolean) => `${n.toString()}`,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        undefined: (_: undefined) => 'null',
        symbol: unsupported,
        function: unsupported,
    }
    return walker[typeof obj](obj)
}

export function toJSDoc<T extends Json>(key: string, obj: ThereforeCommon<T>): string | undefined {
    const docs: string[] = []
    const pad = () => (docs.length > 0 ? docs.push('') : undefined)
    const decription = obj[schema.description]
    if (decription) {
        docs.push(`${decription}`)
    }

    const def = obj[schema.default]
    if (def) {
        pad()
        docs.push(`@default ${toLiteral(def)}`)
    }

    const examples = obj[schema.examples]
    if (examples) {
        pad()
        for (const example of examples) {
            docs.push(`@example ${key} = ${toLiteral(example)}`)
        }
    }

    return docs.length > 0 ? `/**\n * ${docs.join('\n * ')}\n */\n` : undefined
}

export function optional(n: ThereforeTypes): string {
    return n[schema.optional] ? '?' : ''
}

export function readOnly(n: ThereforeTypes): string {
    return n[schema.readonly] ? 'readonly ' : ''
}

export function toDeclaration(
    obj: ObjectType | DictType,
    { name, references }: TypescriptWalkerContext
): { declaration: string; meta?: string; referenceName: string } {
    const writer = createWriter()

    writer
        .write(`export const ${name} = `)
        .block(() => {
            writer.writeLine(`schema: {{schema}},`)
            writer.writeLine(
                `validate: typeof {{schema}} === 'function' ? {{schema}} : new AjvValidator().compile({{schema}}) as {(o: unknown | ${name}): o is ${name};  errors?: null | Array<import("ajv").ErrorObject>},`
            )
            writer.writeLine(`is: (o: unknown | ${name}): o is ${name} => ${name}.validate(o) === true,`)
            writer
                .write(`assert: (o: unknown | ${name}): o is ${name} => `)
                .inlineBlock(() => {
                    writer.write(`if (!${name}.validate(o))`).block(() => {
                        writer.writeLine(`throw new AjvValidator.ValidationError(${name}.validate.errors ?? [])`)
                    })
                    writer.writeLine('return true')
                })
                .write(',')
            if (obj[schema.default]) {
                writer.writeLine(`default: (): ${name} => (${toLiteral(obj[schema.default])}),`)
            }
        })
        .write('\n')
    return {
        declaration: `export interface ${name} ${walkGraph(obj, typescriptVisitor, references)}\n`,
        meta: writer.toString(),
        referenceName: name,
    }
}

export const typeDefinitionVisitor: GraphVisitor<
    { declaration: string; meta?: string; referenceName: string },
    TypescriptWalkerContext
> = {
    object: (obj, context) => toDeclaration(obj, context),
    dict: (obj, context) => toDeclaration(obj, context),
    enum: (obj, context) => {
        const { name } = context
        if (obj.names) {
            const writer = createWriter()
            const names = obj.names
            let referenceName = name
            if (!obj.values.some((v) => typeof v === 'object')) {
                writer.write(`export enum ${name} `).block(() => {
                    for (let i = 0; i < names.length ?? 0; ++i) {
                        writer.writeLine(`${names[i]} = ${toLiteral(obj.values[i])},`)
                    }
                })
            } else {
                writer.write(`export const ${name} = `).block(() => {
                    for (let i = 0; i < names.length ?? 0; ++i) {
                        writer.writeLine(`${names[i]}: ${toLiteral(obj.values[i])} as const,`)
                    }
                })
                referenceName = `keyof typeof ${referenceName}`
            }

            return { declaration: writer.writeLine('').toString(), referenceName }
        }
        return typeDefinitionVisitor._(obj, context)
    },
    _: (obj, { name, references }) => ({
        declaration: `export type ${name} = ${walkGraph(obj, typescriptVisitor, references)}\n`,
        referenceName: name,
    }),
}

export const typescriptVisitor: GraphVisitor<string, TypescriptWalkerContext['references']> = {
    integer: () => 'number',
    unknown: () => 'unknown',
    enum: (obj) => obj.values.map((v) => toLiteral(v)).join(' | '),
    union: (obj, references) => obj.union.map((v) => walkGraph(v, typescriptVisitor, references)).join(' | '),
    intersection: (obj, references) =>
        `(${obj.intersection.map((v) => walkGraph(v, typescriptVisitor, references)).join(' & ')})`,
    object: (obj, references) => {
        const writer = createWriter()
        writer.block(() => {
            for (const [key, value] of Object.entries(obj.properties)) {
                const child = walkGraph(value, typescriptVisitor, references)
                const jsdoc = toJSDoc(key, value)
                writer.writeLine(
                    `${jsdoc ?? ''}${readOnly(value)}${key}${optional(value)}: ${
                        value[schema.nullable] ? `(${child} | null)` : child
                    }`
                )
            }
        })
        return writer.toString()
    },
    array: (obj, references) => `(${walkGraph(obj.items, typescriptVisitor, references)})[]`,
    tuple: (obj, references) => {
        const names = obj.names
        // for named tuples
        if (names !== undefined) {
            return `[${obj.items
                .map((value, i) => `${names[i]}${optional(value)}: ${walkGraph(value, typescriptVisitor, references)}`)
                .join(', ')}]`
        }
        return `[${obj.items.map((i) => walkGraph(i, typescriptVisitor, references)).join(', ')}]`
    },
    dict: (obj, references) => {
        const writer = createWriter()
        writer.inlineBlock(() => {
            writer.writeLine(`[k: string]: ( ${walkGraph(obj.properties, typescriptVisitor, references)} ) | undefined`)
        })

        return writer.toString()
    },
    $ref: (obj, references) => {
        const uuid = obj.reference[schema.uuid]
        if (!references.find((d) => d.uuid === uuid)) {
            references.push({
                name: obj.name,
                uuid: uuid,
            })
        }
        return `{{${uuid}}}`
    },
    _: (obj) => obj[schema.type],
}

export function toTypescriptDefinition(name: string, obj: ThereforeTypes & { [schema.uuid]: string }): TypescriptDefinition {
    const references: TypescriptDefinition['references'] = []

    const interfaceName = camelCase(name, { pascalCase: true })

    const declaration = walkGraph(obj, typeDefinitionVisitor, { name: interfaceName, references })

    return {
        references,
        interfaceName,
        symbolName: name,
        uuid: obj[schema.uuid],
        declaration: declaration.declaration,
        referenceName: declaration.referenceName,
        meta: declaration.meta,
    }
}
