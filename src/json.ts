export type JsonSchemaType =
    | string
    | number
    | boolean
    | null
    | { [property: string]: Readonly<JsonSchemaType> }
    | ReadonlyArray<JsonSchemaType>
export type JsonSchema7TypeName = 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null'

export type SchemaVersion = 'http://json-schema.org/draft-07/schema#'

export interface JsonHyperSchema {
    // https://tools.ietf.org/html/draft-handrews-json-schema-01#section-8.2
    $id?: string
    // https://tools.ietf.org/html/draft-handrews-json-schema-01#section-8.3
    $ref?: string
    // https://tools.ietf.org/html/draft-handrews-json-schema-01#section-7
    $schema?: SchemaVersion
    // https://tools.ietf.org/html/draft-handrews-json-schema-01#section-9
    $comment?: string
    // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
    definitions?: {
        [key: string]: JsonSchema
    }
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
export interface JsonAnyInstance {
    type?: JsonSchema7TypeName | JsonSchema7TypeName[]
    enum?: JsonSchemaType[]
    const?: JsonSchemaType
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
export interface JsonNumericInstance {
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number
    minimum?: number
    exclusiveMinimum?: number
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
export interface JsonStringInstance {
    maxLength?: number
    minLength?: number
    pattern?: string

    // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
    format?:
        | 'date-time'
        | 'time'
        | 'date'
        | 'email'
        | 'idn-email'
        | 'hostname'
        | 'idn-hostname'
        | 'ipv4'
        | 'ipv6'
        | 'uri'
        | 'uri-reference'
        | 'iri'
        | 'iri-reference'
        | 'uri-template'
        | 'json-pointer'
        | 'relative-json-pointer'
        | 'regex'

    // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
    contentMediaType?: string
    contentEncoding?: string
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
export interface JsonArrayInstance {
    items?: JsonSchema | ReadonlyArray<JsonSchema>
    additionalItems?: JsonSchema | false
    maxItems?: number
    minItems?: number
    uniqueItems?: boolean
    contains?: JsonSchema
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
export interface JsonObjectInstance {
    /** @deprecated */
    maxProperties?: number
    /** @deprecated */
    minProperties?: number
    required?: ReadonlyArray<string>
    properties?: Record<string, JsonSchema>
    /** @deprecated */
    patternProperties?: Record<string, JsonSchema>
    additionalProperties?: JsonSchema | false
    dependencies?: Record<string, JsonSchema | ReadonlyArray<string>>
    /** @deprecated */
    propertyNames?: JsonSchema

    // https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
    /** @deprecated */
    if?: JsonSchema
    /** @deprecated */
    then?: JsonSchema
    /** @deprecated */
    else?: JsonSchema
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.7
export interface JsonBooleanLogic {
    allOf?: ReadonlyArray<JsonSchema>
    /** @deprecated */
    anyOf?: ReadonlyArray<JsonSchema>
    oneOf?: ReadonlyArray<JsonSchema>
    /** @deprecated */
    not?: JsonSchema
}

// https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
export interface JsonAnnotations {
    title?: string
    description?: string
    default?: JsonSchemaType
    /** 2019-09 draft */
    depricated?: boolean
    /** @deprecated */
    readOnly?: boolean
    /** @deprecated */
    writeOnly?: boolean
    examples?: JsonSchemaType
}

export type JsonSchema = JsonHyperSchema &
    JsonAnyInstance &
    JsonNumericInstance &
    JsonStringInstance &
    JsonArrayInstance &
    JsonObjectInstance &
    JsonBooleanLogic &
    JsonAnnotations
