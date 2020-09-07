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

export const schema: {
    uuid: typeof uuidSymbol

    type: typeof typeSymbol
    title: typeof titleSymbol
    id: typeof idSymbol
    description: typeof descriptionSymbol

    default: typeof defaultSymbol
    optional: typeof optionalSymbol
    nullable: typeof nullableSymbol

    readonly: typeof readonlySymbol

    examples: typeof examplesSymbol
} = {
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
}

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
    [schema.type]: TypeLiterals
    [schema.title]?: string
    [schema.id]?: string
    [schema.description]?: string

    [schema.optional]?: boolean
    [schema.nullable]?: boolean

    [schema.examples]?: ReadonlyArray<T>
    [schema.default]?: T

    [schema.readonly]?: boolean

    [schema.uuid]?: string
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SchemaOptions<T, K extends keyof any = never> = Partial<Omit<T, typeof schema.type | typeof schema.uuid | K>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OptionKeys<T, E extends keyof any = never> = Omit<
    { [P in keyof T]-?: P },
    typeof schema.type | typeof schema.uuid | E
>
