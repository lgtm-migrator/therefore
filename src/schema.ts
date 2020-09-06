import { JsonSchemaValidator } from './definition'
import { JsonAnnotations, JsonSchema } from './json'
import { Json, schema, ThereforeCommon } from './therefore'
import { filterUndefined } from './util'
import { GraphVisitor, walkGraph } from './ast'
import { ThereforeTypes } from './types/composite'

export interface JsonSchemaWalkerContext {
    //references: Record<string, string>
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
            minLength: definition.minLength,
            maxLength: definition.maxLength,
            pattern: typeof definition.pattern !== 'string' ? definition.pattern?.source : definition.pattern,
            ...annotate(definition),
        })
    },
    number: (definition) => {
        return filterUndefined({
            type: toType('number', definition),
            multipleOf: definition.multipleOf,
            maximum: definition.maximum,
            exclusiveMaximum: definition.exclusiveMaximum,
            minimum: definition.minimum,
            exclusiveMinimum: definition.exclusiveMinimum,
            ...annotate(definition),
        })
    },
    integer: (definition) => {
        return filterUndefined({
            type: toType('integer', definition),
            multipleOf: definition.multipleOf,
            maximum: definition.maximum,
            exclusiveMaximum: definition.exclusiveMaximum,
            minimum: definition.minimum,
            exclusiveMinimum: definition.exclusiveMinimum,
            ...annotate(definition),
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
        return { oneOf: obj.union.map((u) => walkGraph(u, jsonSchemaVisitor, context)) }
    },
    intersection: (obj, context) => {
        return { allOf: obj.intersection.map((u) => walkGraph(u, jsonSchemaVisitor, context)) }
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
            items: walkGraph(definition.items, jsonSchemaVisitor, context),
            ...annotate(definition),
        })
    },
    tuple: (definition, context) => {
        return filterUndefined({
            type: toType('array', definition),
            items: definition.items.map((i) => walkGraph(i, jsonSchemaVisitor, context)),
            additionalItems: false,
            ...annotate(definition),
        })
    },
    dict: (definition, context) => {
        const child = walkGraph(definition.properties, jsonSchemaVisitor, context)
        return {
            type: toType('object', definition),
            additionalProperties: child,
        }
    },
    $ref: (definition, context) => {
        const { definitions } = context
        const uuid = definition.reference[schema.uuid]
        definitions[`{{${uuid}}}`] ??= walkGraph(definition.reference, jsonSchemaVisitor, context)
        if (definition[schema.nullable]) {
            return { oneOf: [{ type: 'null' }, { $ref: `#/definitions/{{${uuid}}}` }] }
        }
        return { $ref: `#/definitions/{{${uuid}}}` }
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
        ...walkGraph(obj, jsonSchemaVisitor, { definitions }),
    }
    if (Object.keys(definitions).length) {
        definition.definitions = definitions
    }
    return { schema: definition }
}
