import { toDeclaration } from './declaration'
import { toJSDoc } from './jsdoc'
import { stringLiteral, toLiteral } from './literal'

import type { TypescriptDefinition } from '../../../definition'
import { defaultAjvConfig } from '../../ajv/defaults'
import type { CstVisitor } from '../../cst/visitor'
import { walkCst } from '../../cst/visitor'
import { isNamedArray, isNamedCstNodeArray } from '../../guard'
import { $ref } from '../../types'
import type { MetaDescription } from '../../types/base'
import type { ThereforeCst } from '../../types/types'
import { createWriter } from '../../writer'

import { evaluate, isAlphaNumeric } from '@zefiros-software/axioms'
import camelCase from 'camelcase'

export interface TypescriptWalkerContext {
    symbolName: string
    references: TypescriptDefinition['references']
    locals: NonNullable<TypescriptDefinition['locals']>
    exportKeyword: string | undefined
    property: string | undefined
    sourceSymbol: string | undefined
}

export function escapeProperty(prop: string): string {
    if (isAlphaNumeric(prop, '_') && !/^[0-9]+/.test(prop)) {
        return prop
    }
    return stringLiteral(prop)
}

export function optional(meta: MetaDescription): string {
    return meta.optional === true ? '?' : ''
}

export function readonly(meta: MetaDescription): string {
    return meta.readonly === true ? 'readonly ' : ''
}

export function writeThereforeSchema({
    symbolName,
    schemaReference,
    validatorFile,
    source,
    sourceSymbol,
    description,
}: {
    symbolName: string
    schemaReference: string
    validatorFile: string | undefined
    source: string
    sourceSymbol: string
    description: MetaDescription
}): string {
    const writer = createWriter()
    const isCompiled = validatorFile !== undefined
    return writer
        .write(`export const ${symbolName} = `)
        .inlineBlock(() => {
            writer.writeLine(
                isCompiled
                    ? `validate: require('${validatorFile}') as ValidateFunction<${symbolName}>,`
                    : `new AjvValidator(${JSON.stringify({
                          ...defaultAjvConfig,
                          ...description.ajvOptions,
                      })}).compile<${symbolName}>(${schemaReference}),`
            )

            writer.writeLine(isCompiled ? `get schema() { return ${symbolName}.validate.schema},` : `schema: ${schemaReference},`)
            writer.writeLine(`source: \`\${__dirname}${source}\`,`)
            writer.writeLine(`sourceSymbol: '${sourceSymbol}',`)
            writer.writeLine(`is: (o: unknown): o is ${symbolName} => ${symbolName}.validate(o) === true,`)
            writer
                .write(`assert: (o: unknown): asserts o is ${symbolName} => `)
                .inlineBlock(() => {
                    writer.write(`if (!${symbolName}.validate(o))`).block(() => {
                        writer.writeLine(`throw new AjvValidator.ValidationError(${symbolName}.validate.errors ?? [])`)
                    })
                })
                .write(',')
        })
        .write(' as const\n')
        .toString()
}

interface TypeDefinition {
    declaration: string
    referenceName: string
}
export const typeDefinitionVisitor: CstVisitor<TypeDefinition, TypescriptWalkerContext> = {
    object: (obj, context) => toDeclaration(obj, context),
    dict: (obj, context) => toDeclaration(obj, context),
    union: (obj, context) => toDeclaration(obj, context),
    ref: (obj, context) => toDeclaration(obj, context),
    enum: (obj, context) => {
        const { symbolName } = context
        const { children } = obj
        if (isNamedArray(children)) {
            const exportString = context.exportKeyword ?? ''
            const writer = createWriter()
            let referenceName = symbolName
            if (!children.some(([, v]) => typeof v === 'object')) {
                writer.write(`${exportString}enum ${symbolName} `).block(() => {
                    for (const [childName, value] of children) {
                        writer.writeLine(`${childName} = ${toLiteral(value)},`)
                    }
                })
            } else {
                writer
                    .write(`${exportString}const ${symbolName}Enum = `)
                    .inlineBlock(() => {
                        for (const [childName, value] of children) {
                            writer.writeLine(`${childName}: ${toLiteral(value)},`)
                        }
                    })
                    .write(' as const')
                    .writeLine(`${exportString}type ${symbolName} = typeof ${symbolName}Enum`)
                referenceName = `keyof typeof ${referenceName}`
            }
            const declaration = writer.writeLine('').toString()
            return {
                declaration,
                referenceName,
            }
        }
        return typeDefinitionVisitor.default(obj, context)
    },
    default: (obj, context: TypescriptWalkerContext): TypeDefinition => {
        const { symbolName, exportKeyword: exportSymbol } = context
        return {
            declaration: `${toJSDoc(symbolName, obj.description) ?? ''}${exportSymbol ?? ''}type ${symbolName} = ${walkCst(
                obj,
                typescriptVisitor,
                context
            )}\n`,
            referenceName: symbolName,
        }
    },
}

export const typescriptVisitor: CstVisitor<string, TypescriptWalkerContext> = {
    integer: () => 'number',
    unknown: () => 'unknown',
    enum: ({ children }) => children.map((v) => toLiteral(v)).join(' | '),
    union: ({ children }, context) =>
        children.map((v) => walkCst<string, TypescriptWalkerContext>(v, typescriptVisitor, context)).join(' | '),
    object: ({ children }, context) => {
        const writer = createWriter()
        writer.block(() => {
            for (const property of children) {
                const { name, description } = property
                const child = walkCst(property, typescriptVisitor, { ...context, property: name })
                const jsdoc = toJSDoc(name, description)
                writer.writeLine(
                    `${jsdoc ?? ''}${readonly(description)}${escapeProperty(name)}${optional(description)}: ${
                        description.nullable ? `(${child} | null)` : child
                    }`
                )
            }
        })
        return writer.toString()
    },
    array: (obj, context) => {
        // @todo a bit more heuristic here
        const isSmall = (t: ThereforeCst) =>
            t.type !== 'object' && t.type !== 'union' && ((t.type === 'enum' && t.children.length < 4) || t.type !== 'enum')

        let localReference: string | undefined = undefined
        const [items] = obj.children as [ThereforeCst]
        if (!isSmall(items)) {
            const { locals } = context
            if (locals[items.uuid] === undefined) {
                const local = toTypescriptDefinition({
                    sourceSymbol: `${context.symbolName}${
                        context.property !== undefined
                            ? camelCase(context.property, {
                                  pascalCase: true,
                              })
                            : ''
                    }${camelCase(obj.type, { pascalCase: true })}`,
                    schema: items,
                    exportSymbol: false,
                    locals,
                })
                locals[local.uuid] = local
            }
            localReference = walkCst($ref([context.property ?? '', items]), typescriptVisitor, context)
        }

        const itemsTs = localReference ?? walkCst<string, TypescriptWalkerContext>(items, typescriptVisitor, context)
        const { minItems, maxItems } = obj.value
        if (minItems !== undefined && minItems > 0 && maxItems === undefined) {
            return `[${`${itemsTs}, `.repeat(minItems)} ...(${itemsTs})[]]`
        } else if (minItems !== undefined && minItems > 0 && maxItems !== undefined && maxItems >= minItems) {
            return ` [${`${itemsTs}, `.repeat(minItems)}${`(${itemsTs})?, `.repeat(maxItems - minItems)}]`
        } else if (maxItems !== undefined && maxItems >= 0) {
            return ` [${`(${itemsTs})?, `.repeat(maxItems)}]`
        }
        return `(${itemsTs})[]`
    },
    tuple: ({ children }, context) => {
        // for named tuples
        if (isNamedCstNodeArray(children)) {
            return `[${children
                .map((child) => `${child.name}${optional(child.description)}: ${walkCst(child, typescriptVisitor, context)}`)
                .join(', ')}]`
        }
        return `[${children.map((node) => walkCst(node, typescriptVisitor, context)).join(', ')}]`
    },
    dict: ({ children }, context) => {
        const [items] = children
        const writer = createWriter()
        writer.inlineBlock(() => {
            writer.writeLine(`[k: string]: ( ${walkCst(items, typescriptVisitor, context)} ) | undefined`)
        })

        return writer.toString()
    },
    ref: ({ children }, { references }) => {
        const [name, unevaluatedReference] = children
        const reference = evaluate(unevaluatedReference)

        const uuid = reference.uuid
        if (!references.find((d) => d.uuid === uuid)) {
            const referenceName = camelCase(name, { pascalCase: true })
            references.push({
                reference: [name, reference],
                name: name,
                referenceName,
                uuid: uuid,
            })
        }
        return `{{${uuid}}}`
    },
    default: (obj, _context): string => obj.type,
}

export function toTypescriptDefinition({
    sourceSymbol,
    schema,
    exportSymbol = true,
    locals = {},
}: {
    sourceSymbol: string
    schema: ThereforeCst & { uuid: string }
    exportSymbol?: boolean
    locals?: TypescriptDefinition['locals']
}): TypescriptDefinition {
    // allow propagation and deduplication
    locals ??= {}
    const references: TypescriptDefinition['references'] = []

    const symbolName = camelCase(sourceSymbol, { pascalCase: true })

    const declaration = walkCst(schema, typeDefinitionVisitor, {
        symbolName,
        references,
        locals,
        exportKeyword: exportSymbol ? 'export ' : '',
        sourceSymbol,
        property: undefined,
    })

    return {
        references,
        sourceSymbol,
        symbolName,
        uuid: schema.uuid,
        declaration: declaration.declaration,
        referenceName: declaration.referenceName,
        isExported: exportSymbol,
        schema: () => schema,
        locals,
    }
}
