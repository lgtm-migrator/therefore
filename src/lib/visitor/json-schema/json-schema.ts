import type { JsonSchemaValidator } from '../../../definition'
import type { JsonAnnotations, JsonSchema, JsonSchema7TypeName } from '../../../json'
import { defaultAjvConfig } from '../../ajv/defaults'
import type { CstNode } from '../../cst/cst'
import type { CstVisitor } from '../../cst/visitor'
import { walkCst } from '../../cst/visitor'
import { isNamedArray } from '../../guard'
import type { MetaDescription } from '../../types/base'
import type { ThereforeCst } from '../../types/types'

import type { RelaxedPartial } from '@zefiros-software/axioms'
import { evaluate, omit, isArray, omitUndefined } from '@zefiros-software/axioms'
import Ajv from 'ajv'
import standaloneCode from 'ajv/dist/standalone'

export interface JsonSchemaWalkerContext {
    //references: Record<string, string>
    entry?: CstNode | undefined
    definitions: NonNullable<JsonSchema['definitions']>
    transform: (node: CstNode, schema: RelaxedPartial<JsonSchema>) => JsonSchema
}

export function toType(type: JsonSchema['type'], definition: MetaDescription): JsonSchema['type'] {
    if (type === undefined) {
        return undefined
    }
    return definition.nullable ? ((isArray(type) ? [...type, 'null'] : [type, 'null']) as JsonSchema7TypeName[]) : type
}

export function annotate(doc: MetaDescription): JsonAnnotations {
    return omitUndefined({
        title: doc.title,
        description: doc.description,
        default: doc.default,
        readonly: doc.readonly,
        // writeonly?: boolean
        examples: doc.examples,
        deprecated: doc.deprecated,
    })
}

export const jsonSchemaVisitor: CstVisitor<RelaxedPartial<JsonSchema>, JsonSchemaWalkerContext> = {
    string: ({ value: image }) => ({
        type: 'string',
        ...image,
        pattern: typeof image.pattern !== 'string' ? image.pattern?.source : image.pattern,
    }),
    number: (node) => ({
        type: 'number',
        ...node.value,
    }),
    integer: (node) => ({
        type: 'integer',
        ...node.value,
    }),
    boolean: (node) => ({
        type: 'boolean',
        ...node.value,
    }),
    null: () => ({
        type: 'null',
    }),
    unknown: () => ({}),
    enum: ({ children }) => {
        const values = isNamedArray(children) ? children.map(([, c]) => c) : children
        if (values.length === 1) {
            return {
                const: values[0],
            }
        }
        return {
            enum: values,
        }
    },
    union: ({ children }, context) => {
        return {
            oneOf: children.map((u) => walkCst(u, jsonSchemaVisitor, context)),
        }
    },
    object: ({ children, value }, context) => {
        const properties: NonNullable<JsonSchema['properties']> = {}
        const required: string[] = []
        for (const child of children) {
            properties[child.name] = walkCst(child, jsonSchemaVisitor, context)
            if (!child.description.optional) {
                required.push(child.name)
            }
        }
        return {
            type: 'object',
            properties,
            required,
            additionalProperties:
                value.indexSignature !== undefined ? walkCst(value.indexSignature, jsonSchemaVisitor, context) : false,
        }
    },
    array: (node, context) => {
        const [items] = node.children
        return {
            type: 'array',
            items: walkCst(items, jsonSchemaVisitor, context),
            ...node.value,
        }
    },
    tuple: ({ children }, context) => {
        return {
            type: 'array',
            items: children.map((c) => walkCst(c, jsonSchemaVisitor, context)),
            additionalItems: false,
            minItems: children.length,
        }
    },
    dict: ({ children }, context) => {
        const [items] = children
        return {
            type: 'object',
            additionalProperties: walkCst(items, jsonSchemaVisitor, context),
        }
    },
    ref: ({ children, description }, context) => {
        const [, unevaluatedReference] = children
        const reference = evaluate(unevaluatedReference)

        const { definitions, entry } = context

        const uuid = reference.uuid

        if (entry && uuid === entry.uuid) {
            // we referenced the root of the schema
            return { $ref: '#' }
        }
        if (definitions[`{{${uuid}}}`] === undefined) {
            definitions[`{{${uuid}}}`] = {} // mark spot as taken (prevents recursion)
            definitions[`{{${uuid}}}`] = walkCst(reference, jsonSchemaVisitor, context)
        }
        if (description.nullable) {
            return { oneOf: [{ type: 'null' }, { $ref: `#/definitions/{{${uuid}}}` }] }
        }
        return { $ref: `#/definitions/{{${uuid}}}` }
    },
    default: (node) => {
        console.error(node)
        throw new Error('should not be called')
    },
}

export function jsonSchemaContext(obj?: ThereforeCst): JsonSchemaWalkerContext {
    return {
        definitions: {},
        entry: obj,
        transform: (node, schema): JsonSchema => {
            return omitUndefined({
                type: toType(schema.type, node.description),
                ...annotate(node.description),
                ...omit(schema, ['type']),
            })
        },
    }
}

export function toJsonSchema(obj: ThereforeCst, compile: true): Extract<JsonSchemaValidator, { compiled: true }>
export function toJsonSchema(obj: ThereforeCst, compile?: boolean): JsonSchemaValidator
export function toJsonSchema(obj: ThereforeCst, compile = false): JsonSchemaValidator {
    //const references: Record<string, string> = {}
    const context = jsonSchemaContext(obj)
    const definition: JsonSchema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...walkCst(obj, jsonSchemaVisitor, context),
    }
    if (Object.keys(context.definitions).length > 0) {
        definition.definitions = context.definitions
    }
    if (compile) {
        const ajv = new Ajv({
            ...defaultAjvConfig,
            ...obj.description.ajvOptions,
            code: {
                source: true,
                optimize: true,
            },
        })
        const validator = ajv.compile(definition)
        return { schema: definition, code: standaloneCode(ajv, validator), validator, compiled: true }
    }
    return { schema: definition, compiled: false }
}
