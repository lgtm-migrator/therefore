import type { TypescriptDefinition } from './definition'
import type { Json, ThereforeCommon } from './therefore'
import { schema } from './therefore'
import type { DictType, IntersectionType, ObjectType, RefType, ThereforeTypes, UnionType } from './types/composite'
import { $ref } from './types/composite'
import type { GraphVisitor } from './ast'
import { walkGraph } from './ast'
import { isEnum, isIntersection, isObject, isUnion } from './guard'

import camelCase from 'camelcase'
import CodeBlockWriter from 'code-block-writer'

export interface TypescriptWalkerContext {
    name: string
    references: TypescriptDefinition['references']
    locals: NonNullable<TypescriptDefinition['locals']>
    exportSymbol?: string
    property?: string
}

export function escapeProperty(prop: string): string {
    if (prop.length && /[A-Za-z_$]/.test(prop.charAt(0)) && /^[\w$]+$/.test(prop)) {
        return prop
    }
    return JSON.stringify(prop)
}

const createWriter = () =>
    new CodeBlockWriter({
        indentNumberOfSpaces: 4,
        useSingleQuote: true,
    })

export function toLiteral(obj: unknown): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        undefined: (_: undefined) => 'null',
        symbol: unsupported,
        function: unsupported,
    }
    return walker[typeof obj](obj)
}

export function toJSDoc<T extends Json>(key: string, obj: ThereforeCommon<T>): string | undefined {
    const docs: string[] = []
    const pad = () => (docs.length > 0 ? docs.push('') : undefined)
    const description = obj[schema.description] ?? obj[schema.title]
    if (description !== undefined) {
        docs.push(...description.split('\n'))
    }
    const properties: string[] = []

    const def = obj[schema.default]
    if (def !== undefined) {
        properties.push(`@default ${toLiteral(def)}`)
    }
    const readonly = obj[schema.readonly]
    if (readonly !== undefined && readonly) {
        properties.push(`@readonly`)
    }

    if (properties.length > 0) {
        pad()

        docs.push(...properties)
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

export function optional(n: Pick<ThereforeTypes, typeof schema.optional> | unknown): string {
    return (n as Record<typeof schema.optional, unknown>)[schema.optional] === true ? '?' : ''
}

export function readonly(n: Pick<ThereforeTypes, typeof schema.readonly> | unknown): string {
    return (n as Record<typeof schema.readonly, unknown>)[schema.readonly] === true ? 'readonly ' : ''
}

export function toObjectDeclaration(
    obj: ObjectType | DictType,
    context: TypescriptWalkerContext
): { declaration: string; meta?: string; referenceName: string } {
    const { name, exportSymbol } = context
    const writer = createWriter()

    const exportString = exportSymbol ?? ''
    if (exportString) {
        writeThereforeSchema(writer, name, obj)
    }
    return {
        declaration: `${toJSDoc(name, obj) ?? ''}${exportString}interface ${name} ${walkGraph(
            obj,
            typescriptVisitor,
            context
        )}\n`,
        meta: exportString ? writer.toString() : undefined,
        referenceName: name,
    }
}

export function toTypeDeclaration(
    obj: UnionType | IntersectionType | RefType,
    context: TypescriptWalkerContext
): { declaration: string; meta?: string; referenceName: string } {
    const { name, references, locals, exportSymbol } = context
    const writer = createWriter()

    const exportString = exportSymbol ?? ''
    if (exportString) {
        writeThereforeSchema(writer, name, obj)
    }
    return {
        declaration: `${toJSDoc(name, obj) ?? ''}${exportSymbol ?? ''}type ${name} = ${walkGraph(obj, typescriptVisitor, {
            name,
            references,
            locals,
            exportSymbol,
        })}\n`,
        meta: exportString ? writer.toString() : undefined,
        referenceName: name,
    }
}

function writeThereforeSchema(writer: CodeBlockWriter, name: string, obj: ThereforeTypes) {
    writer
        .write(`export const ${name} = `)
        .block(() => {
            writer.writeLine(`schema: {{schema}},`)
            writer.writeLine(
                `validate: new AjvValidator(${
                    obj.ajvOptions ? JSON.stringify(obj.ajvOptions) : ''
                }).compile<${name}>({{schema}}),`
            )
            writer.writeLine(`is: (o: unknown): o is ${name} => ${name}.validate(o) === true,`)
            writer
                .write(`assert: (o: unknown): asserts o is ${name} => `)
                .inlineBlock(() => {
                    writer.write(`if (!${name}.validate(o))`).block(() => {
                        writer.writeLine(`throw new AjvValidator.ValidationError(${name}.validate.errors ?? [])`)
                    })
                })
                .write(',')
            if (obj[schema.default] !== undefined) {
                writer.writeLine(`default: (): ${name} => (${toLiteral(obj[schema.default])}),`)
            }
        })
        .write('\n')
}

export const typeDefinitionVisitor: GraphVisitor<
    { declaration: string; meta?: string; referenceName: string },
    TypescriptWalkerContext
> = {
    object: (obj, context) => toObjectDeclaration(obj, context),
    dict: (obj, context) => toObjectDeclaration(obj, context),
    union: (obj, context) => toTypeDeclaration(obj, context),
    intersection: (obj, context) => toTypeDeclaration(obj, context),
    $ref: (obj, context) => toTypeDeclaration(obj, context),
    enum: (obj, context) => {
        const { name } = context
        if (obj.names) {
            const exportString = context.exportSymbol ?? ''
            let writer = createWriter()
            const names = obj.names
            let referenceName = name
            if (!obj.values.some((v) => typeof v === 'object')) {
                writer.write(`${exportString}enum ${name} `).block(() => {
                    for (let i = 0; i < names.length ?? 0; ++i) {
                        writer.writeLine(`${names[i]!} = ${toLiteral(obj.values[i]!)},`)
                    }
                })
            } else {
                writer
                    .write(`${exportString}const ${name}Enum = `)
                    .inlineBlock(() => {
                        for (let i = 0; i < names.length ?? 0; ++i) {
                            writer.writeLine(`${names[i]!}: ${toLiteral(obj.values[i]!)},`)
                        }
                    })
                    .write(' as const')
                    .writeLine(`${exportString}type ${name} = typeof ${name}Enum`)
                referenceName = `keyof typeof ${referenceName}`
            }
            const declaration = writer.writeLine('').toString()
            writer = createWriter()
            if (exportString) {
                writeThereforeSchema(writer, name, obj)
            }
            return {
                declaration,
                meta: exportString ? writer.toString() : undefined,
                referenceName,
            }
        }
        return typeDefinitionVisitor._(obj, context)
    },
    _: (obj, { name, references, locals, exportSymbol }) => ({
        declaration: `${toJSDoc(name, obj) ?? ''}${exportSymbol ?? ''}type ${name} = ${walkGraph(obj, typescriptVisitor, {
            name,
            references,
            locals,
            exportSymbol,
        })}\n`,
        referenceName: name,
    }),
}

export const typescriptVisitor: GraphVisitor<string, TypescriptWalkerContext> = {
    integer: () => 'number',
    unknown: () => 'unknown',
    enum: (obj) => obj.values.map((v) => toLiteral(v)).join(' | '),
    union: (obj, context) => obj.union.map((v) => walkGraph(v, typescriptVisitor, context)).join(' | '),
    intersection: (obj, context) => `(${obj.intersection.map((v) => walkGraph(v, typescriptVisitor, context)).join(' & ')})`,
    object: (obj, context) => {
        const writer = createWriter()
        writer.block(() => {
            for (const [key, value] of Object.entries(obj.properties)) {
                const child = walkGraph(value, typescriptVisitor, { ...context, property: key })
                const jsdoc = toJSDoc(key, value)
                writer.writeLine(
                    `${jsdoc ?? ''}${readonly(value)}${escapeProperty(key)}${optional(value)}: ${
                        value[schema.nullable] ? `(${child} | null)` : child
                    }`
                )
            }
        })
        return writer.toString()
    },
    array: (obj, context) => {
        // @todo a bit more heuristic here
        const isSmall = (t: ThereforeTypes) =>
            !isObject(t) && !isUnion(t) && !isIntersection(t) && ((isEnum(t) && t.values.length < 4) || !isEnum(t))

        let localReference: string | undefined = undefined
        if (!isSmall(obj.items)) {
            const { locals } = context
            if (locals[obj.items.uuid] === undefined) {
                const local = toTypescriptDefinition(
                    `${context.name}${
                        context.property !== undefined
                            ? camelCase(context.property, {
                                  pascalCase: true,
                              })
                            : ''
                    }${camelCase(obj.type, { pascalCase: true })}`,
                    obj.items,
                    false,
                    locals
                )
                locals[local.uuid] = local
            }
            localReference = walkGraph($ref({ [context.property!]: obj.items }), typescriptVisitor, context)
        }

        const items = localReference ?? walkGraph(obj.items, typescriptVisitor, context)
        const minItems = obj.minItems
        const maxItems = obj.maxItems
        if (minItems !== undefined && minItems > 0 && obj.maxItems === undefined) {
            return `[${`${items}, `.repeat(minItems)} ...(${items})[]]`
        } else if (minItems !== undefined && minItems > 0 && maxItems !== undefined && maxItems >= minItems) {
            return ` [${`${items}, `.repeat(minItems)}${`(${items})?, `.repeat(maxItems - minItems)}]`
        } else if (maxItems !== undefined && maxItems >= 0) {
            return ` [${`(${items})?, `.repeat(maxItems)}]`
        }
        return `(${items})[]`
        //throw new Error('foo')
    },
    tuple: (obj, context) => {
        const names = obj.names
        // for named tuples
        if (names !== undefined) {
            return `[${obj.items
                .map((value, i) => `${names[i]!}${optional(value)}: ${walkGraph(value, typescriptVisitor, context)}`)
                .join(', ')}]`
        }
        return `[${obj.items.map((i) => walkGraph(i, typescriptVisitor, context)).join(', ')}]`
    },
    dict: (obj, context) => {
        const writer = createWriter()
        writer.inlineBlock(() => {
            writer.writeLine(`[k: string]: ( ${walkGraph(obj.properties, typescriptVisitor, context)} ) | undefined`)
        })

        return writer.toString()
    },
    $ref: (obj, { references }) => {
        const reference = typeof obj.reference === 'function' ? obj.reference() : obj.reference

        const uuid = reference[schema.uuid]
        if (!references.find((d) => d.uuid === uuid)) {
            const referenceName = camelCase(obj.name, { pascalCase: true })
            references.push({
                reference: reference,
                name: obj.name,
                referenceName,
                uuid: uuid,
            })
        }
        return `{{${uuid}}}`
    },
    _: (obj) => obj[schema.type],
}

export function toTypescriptDefinition(
    name: string,
    obj: ThereforeTypes & { [schema.uuid]: string },
    exportSymbol = true,
    locals: TypescriptDefinition['locals'] = {}
): TypescriptDefinition {
    // allow propagation and deduplication
    locals ??= {}
    const references: TypescriptDefinition['references'] = []

    const interfaceName = camelCase(name, { pascalCase: true })

    const declaration = walkGraph(obj, typeDefinitionVisitor, {
        name: interfaceName,
        references,
        locals,
        exportSymbol: exportSymbol ? 'export ' : '',
    })

    return {
        references,
        interfaceName,
        symbolName: name,
        uuid: obj[schema.uuid],
        declaration: declaration.declaration,
        referenceName: declaration.referenceName,
        meta: declaration.meta,
        locals,
    }
}
