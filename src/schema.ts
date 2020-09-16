import type { JsonSchemaValidator } from './definition'
import type { JsonAnnotations, JsonSchema } from './json'
import type { Json, ThereforeCommon } from './therefore'
import { schema } from './therefore'
import { filterUndefined } from './util'
import type { GraphVisitor } from './ast'
import { walkGraph } from './ast'
import type { ThereforeTypes } from './types/composite'

export interface JsonSchemaWalkerContext {
    //references: Record<string, string>
    entry: ThereforeTypes
    definitions: NonNullable<JsonSchema['definitions']>
}

export function toType<T>(type: T, definition: ThereforeCommon): [T, 'null'] | T {
    return definition[schema.nullable] ? [type, 'null'] : type
}

export function annotate<T extends Json>(doc: ThereforeCommon<T>): JsonAnnotations {
    return filterUndefined({
        title: doc[schema.title],
        description: doc[schema.description],
        default: doc[schema.default],
        readonly: doc[schema.readonly],
        // writeonly?: boolean
        examples: doc[schema.examples],
    })
}

export const jsonSchemaVisitor: GraphVisitor<JsonSchema, JsonSchemaWalkerContext> = {
    string: (definition) => {
        return filterUndefined({
            type: toType('string', definition),
            ...annotate(definition),
            minLength: definition.minLength,
            maxLength: definition.maxLength,
            pattern: typeof definition.pattern !== 'string' ? definition.pattern?.source : definition.pattern,
        })
    },
    number: (definition) => {
        return filterUndefined({
            type: toType('number', definition),
            ...annotate(definition),
            multipleOf: definition.multipleOf,
            maximum: definition.maximum,
            exclusiveMaximum: definition.exclusiveMaximum,
            minimum: definition.minimum,
            exclusiveMinimum: definition.exclusiveMinimum,
        })
    },
    integer: (definition) => {
        return filterUndefined({
            type: toType('integer', definition),
            ...annotate(definition),
            multipleOf: definition.multipleOf,
            maximum: definition.maximum,
            exclusiveMaximum: definition.exclusiveMaximum,
            minimum: definition.minimum,
            exclusiveMinimum: definition.exclusiveMinimum,
        })
    },
    boolean: (definition) => {
        return filterUndefined({
            type: toType('boolean', definition),
            ...annotate(definition),
        })
    },
    null: (definition) => {
        return filterUndefined({
            type: 'null',
            ...annotate(definition),
        })
    },
    enum: (definition) => {
        if (definition.values.length === 1) {
            return filterUndefined({
                const: definition.values[0],
                ...annotate(definition),
            })
        }
        const values: Json[] = [...definition.values]
        return filterUndefined({
            enum: values,
            ...annotate(definition),
        })
    },
    unknown: () => ({}),
    union: (obj, context) => {
        return { oneOf: obj.union.map((u) => walkGraph(u, jsonSchemaVisitor, context)), ...annotate(obj) }
    },
    intersection: (obj, context) => {
        return { allOf: obj.intersection.map((u) => walkGraph(u, jsonSchemaVisitor, context)), ...annotate(obj) }
    },
    object: (definition, context) => {
        const properties: NonNullable<JsonSchema['properties']> = {}
        const required: string[] = []
        for (const [key, value] of Object.entries(definition.properties)) {
            properties[key] = walkGraph(value, jsonSchemaVisitor, context)
            if (!value[schema.optional]) {
                required.push(key)
            }
        }
        const obj: JsonSchema = filterUndefined({
            type: toType('object', definition),
            ...annotate(definition),
            properties,
            required,
            additionalProperties: false,
        })
        return obj
    },
    array: (definition, context) => {
        return filterUndefined({
            type: toType('array', definition),
            ...annotate(definition),
            items: walkGraph(definition.items, jsonSchemaVisitor, context),
            minItems: definition.minItems,
            maxItems: definition.maxItems,
            uniqueItems: definition.uniqueItems,
        })
    },
    tuple: (definition, context) => {
        return filterUndefined({
            type: toType('array', definition),
            ...annotate(definition),
            items: definition.items.map((i) => walkGraph(i, jsonSchemaVisitor, context)),
            additionalItems: false,
        })
    },
    dict: (definition, context) => {
        const child = walkGraph(definition.properties, jsonSchemaVisitor, context)
        return {
            type: toType('object', definition),
            ...annotate(definition),
            additionalProperties: child,
        }
    },
    $ref: (definition, context) => {
        const { definitions, entry } = context

        const reference = typeof definition.reference === 'function' ? definition.reference() : definition.reference
        const uuid = reference[schema.uuid]

        if (uuid === entry[schema.uuid]) {
            // we referenced the root of the schema
            return { $ref: '#' }
        }
        if (definitions[`{{${uuid}}}`] === undefined) {
            definitions[`{{${uuid}}}`] = {} // mark spot as taken (prevents recursion)
            definitions[`{{${uuid}}}`] = walkGraph(reference, jsonSchemaVisitor, context)
        }
        if (definition[schema.nullable]) {
            return { oneOf: [{ type: 'null' }, { $ref: `#/definitions/{{${uuid}}}` }], ...annotate(definition) }
        }
        return { $ref: `#/definitions/{{${uuid}}}`, ...annotate(definition) }
    },
    _: () => {
        throw new Error('should not be called')
    },
}

export function toJsonSchema(obj: ThereforeTypes): JsonSchemaValidator {
    //const references: Record<string, string> = {}
    const definitions: NonNullable<JsonSchema['definitions']> = {}
    const definition: JsonSchema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        ...walkGraph(obj, jsonSchemaVisitor, { definitions, entry: obj }),
    }
    if (Object.keys(definitions).length) {
        definition.definitions = definitions
    }
    return { schema: definition }
}
