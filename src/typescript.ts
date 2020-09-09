import { TypescriptDefinition } from './definition'
import { Json, schema, ThereforeCommon } from './therefore'
import { $ref, DictType, ObjectType, ThereforeTypes } from './types/composite'
import { GraphVisitor, walkGraph } from './ast'
import { isEnum, isIntersection, isObject, isUnion } from './cli'

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
    const decription = obj[schema.description] ?? obj[schema.title]
    if (decription !== undefined) {
        docs.push(...decription.split('\n'))
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

export function toDeclaration(
    obj: ObjectType | DictType,
    context: TypescriptWalkerContext
): { declaration: string; meta?: string; referenceName: string } {
    const { name, exportSymbol } = context
    const writer = createWriter()

    const exportString = exportSymbol ?? ''
    if (exportString) {
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

export const typeDefinitionVisitor: GraphVisitor<
    { declaration: string; meta?: string; referenceName: string },
    TypescriptWalkerContext
> = {
    object: (obj, context) => toDeclaration(obj, context),
    dict: (obj, context) => toDeclaration(obj, context),
    enum: (obj, context) => {
        const { name } = context
        if (obj.names) {
            const exportString = context.exportSymbol ?? ''
            const writer = createWriter()
            const names = obj.names
            let referenceName = name
            if (!obj.values.some((v) => typeof v === 'object')) {
                writer.write(`${exportString}enum ${name} `).block(() => {
                    for (let i = 0; i < names.length ?? 0; ++i) {
                        writer.writeLine(`${names[i]} = ${toLiteral(obj.values[i])},`)
                    }
                })
            } else {
                writer.write(`${exportString}const ${name} = `).block(() => {
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
                    `${context.name}${camelCase(context.property ?? obj.type, { pascalCase: true })}`,
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
                .map((value, i) => `${names[i]}${optional(value)}: ${walkGraph(value, typescriptVisitor, context)}`)
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
        const uuid = obj.reference[schema.uuid]
        if (!references.find((d) => d.uuid === uuid)) {
            const referenceName = camelCase(obj.name, { pascalCase: true })
            references.push({
                reference: obj.reference,
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
