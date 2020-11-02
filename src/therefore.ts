const typeSymbol = 'type' // Symbol('type')
const titleSymbol = 'title' // Symbol('title')
const idSymbol = 'id' // Symbol('id')
const descriptionSymbol = 'description' // Symbol('description')

const defaultSymbol = 'default' // Symbol('default')
const optionalSymbol = 'optional' // Symbol('optional')
const nullableSymbol = 'nullable' // Symbol('nullable')
const examplesSymbol = 'examples' // Symbol('example')

const readonlySymbol = 'readonly' // Symbol('readonly')
//const writeonlySymbol = ('readonly') // Symbol('readonly')

const uuidSymbol = 'uuid' // Symbol('uuid')

export const schema = {
    uuid: uuidSymbol,

    type: typeSymbol,
    title: titleSymbol,
    id: idSymbol,
    description: descriptionSymbol,

    default: defaultSymbol,
    optional: optionalSymbol,
    nullable: nullableSymbol,

    readonly: readonlySymbol,

    examples: examplesSymbol,
} as const

export type Json = string | number | boolean | null | { [property: string]: Json } | ReadonlyArray<Json>
export type TypeLiterals =
    | 'object'
    | 'array'
    | 'tuple'
    | 'dict'
    | '$ref'
    | 'enum'
    | 'string'
    | 'number'
    | 'integer'
    | 'boolean'
    | 'null'
    | 'unknown'
    | 'union'
    | 'intersection'

export interface ThereforeCommon<T extends Json = Json> {
    /**
     * @internal
     */
    [schema.type]: TypeLiterals

    /**
     * Can be used to decorate a user interface with information about the data produced by this user interface. The title
     * preferable should be short, whereas the description provides a more detailed explanation.
     *
     * Reference: https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9.1
     */
    [schema.title]?: string

    /**
     * Identifies a schema resource with a canonical URI.
     * Note that this URI is an identifier and not necessarily a network locator.
     * In the case of a network-addressable URL, a schema need not be downloadable from its canonical URI.
     *
     * If present, the value for this keyword MUST be a string, and MUST represent a valid URI-reference.
     * This URI-reference SHOULD be normalized, and MUST resolve to an absolute-URI (without a fragment).
     * Therefore, "id" MUST NOT contain a non-empty fragment, and SHOULD NOT contain an empty fragment.
     *
     * Reference: https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.8.2.2
     */
    [schema.id]?: string

    /**
     * Can be used to decorate a user interface with information about the data produced by this user interface. The description
     * will provide explanation about the purpose of the instance described by this schema.
     *
     * Reference: https://json-schema.org/draft/2019-09/json-schema-validation.html#rfc.section.9.1
     */
    [schema.description]?: string

    /**
     * Mark the property as optional (either defined, or not present).
     *
     * @example
     *
     *      $string({optional: true})
     *
     * @see {@link $optional} for a helper function.
     */

    [schema.optional]?: boolean

    /**
     * Mark the property as nullable (either defined or null, but present).
     *
     * @example
     *
     *      $string({nullable: true})
     *
     * @see {@link $nullable} for a helper function.
     */
    [schema.nullable]?: boolean

    /**
     * Gives a few examples of allowed values.
     */
    [schema.examples]?: ReadonlyArray<T>

    /**
     * Specifies the default value that is used when no value is found during validation (dependend on validation options).
     */
    [schema.default]?: T

    /**
     * The property is marked explicitly as `readonly`, and any changes to the value should be avoided.
     *
     * @example
     *
     *      $string({readonly: true})
     */
    [schema.readonly]?: boolean

    /**
     * @internal
     */
    [schema.uuid]: string
}

export const commonOptions = {
    title: schema.title,
    id: schema.id,
    description: schema.description,

    optional: schema.optional,
    nullable: schema.nullable,

    examples: schema.examples,
    default: schema.default,

    readonly: schema.readonly,
}

/**
 *
 *
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaOptions<T, K extends keyof any = never> = Partial<Omit<T, typeof schema.type | typeof schema.uuid | K>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OptionKeys<T, E extends keyof any = never> = Omit<
    { [P in keyof T]-?: P },
    typeof schema.type | typeof schema.uuid | E
>
