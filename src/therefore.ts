const typeSymbol = Symbol('type')
const titleSymbol = Symbol('title')
const idSymbol = Symbol('id')
const descriptionSymbol = Symbol('description')

const defaultSymbol = Symbol('default')
const optionalSymbol = Symbol('optional')
const nullableSymbol = Symbol('nullable')
const examplesSymbol = Symbol('example')

const readOnlySymbol = Symbol('readOnly')
//const writeOnlySymbol = Symbol('readOnly')

const uuidSymbol = Symbol('uuid')

export const schema: {
    uuid: typeof uuidSymbol

    type: typeof typeSymbol
    title: typeof titleSymbol
    id: typeof idSymbol
    description: typeof descriptionSymbol

    default: typeof defaultSymbol
    optional: typeof optionalSymbol
    nullable: typeof nullableSymbol

    readonly: typeof readOnlySymbol

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

    readonly: readOnlySymbol,

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
