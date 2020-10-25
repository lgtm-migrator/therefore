import { $boolean } from './boolean'
import type { EnumType } from './enum'
import { $integer } from './integer'
import { $null } from './null'
import { $number } from './number'
import { $string } from './string'
import { $unknown } from './unknown'

import type { Json, OptionKeys, SchemaOptions, ThereforeCommon } from '../therefore'
import { commonOptions, schema } from '../therefore'
import { filterUndefined } from '../util'
import { isShorthand } from '../guard'

import { v4 as uuid } from 'uuid'

export type ThereforeTypesExpandable =
    | typeof $string
    | typeof $number
    | typeof $integer
    | typeof $boolean
    | typeof $null
    | typeof $unknown

export type ThereforeTypes =
    | ObjectType
    | ArrayType
    | TupleType
    | DictType
    | RefType
    | EnumType
    | UnionType
    | IntersectionType
    | ReturnType<ThereforeTypesExpandable>

export function isExpandable(v: ThereforeTypesExpandable | ThereforeTypes | undefined | unknown): v is ThereforeTypesExpandable {
    return v === $string || v === $number || v === $integer || v === $boolean || v === $null || v === $unknown
}

// #region Objects

export interface ObjectProperties<Types = ThereforeTypes | ThereforeTypesExpandable> {
    [k: string]: Types
}

export interface ObjectOptions<Types = ThereforeTypes | ThereforeTypesExpandable> {
    [schema.type]: 'object'
    [schema.uuid]: string
    properties: ObjectProperties<Types>
    /** @deprecated */
    minProperties?: number
    /** @deprecated */
    maxProperties?: number
}

export type ObjectType = ObjectOptions<ThereforeTypes> & ThereforeCommon<{ [property: string]: Json }>

const objectProperties: OptionKeys<ObjectType, 'properties'> = {
    ...commonOptions,
    minProperties: 'minProperties',
    maxProperties: 'maxProperties',
}

type ObjectPropertiesArg =
    | {
          [K in keyof SchemaOptions<ObjectType, 'properties'>]:
              | SchemaOptions<ObjectType, 'properties'>[K]
              | ThereforeTypes
              | ThereforeTypesExpandable
      }
    | { [k: string]: ThereforeTypes | ThereforeTypesExpandable }

function objectFunction(properties?: ObjectPropertiesArg, options: SchemaOptions<ObjectType, 'properties'> = {}): ObjectType {
    const expanded = Object.entries(properties ?? []).map(([k, v]) => (isExpandable(v) ? ([k, v()] as const) : ([k, v] as const)))
    const filteredProperties: ObjectProperties<ThereforeTypes> = Object.fromEntries(
        expanded.filter(([_, v]) => isShorthand(v)) as [string, ThereforeTypes][]
    )
    const annotations: SchemaOptions<ObjectType, 'properties'> = Object.fromEntries(
        expanded.filter(([k, v]) => (objectProperties as Record<string, unknown>)[k] !== undefined && !isShorthand(v))
    )

    const objectDefinition: Omit<ObjectType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'object',
        ...annotations,
        ...options,
        properties: filteredProperties,
    })
    return { ...objectDefinition, [schema.uuid]: uuid() }
}
type ObjectInterface = OptionKeys<ObjectType, 'properties'> & typeof objectFunction

export const $object: ObjectInterface = Object.assign(objectFunction, objectProperties)

// #endregion

// #region Arrays

export interface ArrayOptions<Types = ThereforeTypes | ThereforeTypesExpandable> {
    [schema.type]: 'array'
    [schema.uuid]: string
    items: Types
    minItems?: number
    maxItems?: number
    uniqueItems?: boolean
}
export type ArrayType = ArrayOptions<ThereforeTypes> & ThereforeCommon<Json[]>

export function $array(
    items: ThereforeTypes | ThereforeTypesExpandable,
    options: SchemaOptions<ArrayType, 'items'> = {}
): ArrayType {
    const expanded: ThereforeTypes = isExpandable(items) ? items() : items
    const arrayDefinition: Omit<ArrayType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'array',
        ...options,
        items: expanded,
    })
    return { ...arrayDefinition, [schema.uuid]: uuid() }
}

// #endregion

// #region Dict

export interface DictOptions {
    [schema.type]: 'dict'
    [schema.uuid]: string
    properties: ThereforeTypes
}
export type DictType = DictOptions & ThereforeCommon<Record<string, Json>>

export function $dict(
    items: ThereforeTypes | ThereforeTypesExpandable,
    options: SchemaOptions<DictType, 'properties'> = {}
): DictType {
    const expanded: ThereforeTypes = isExpandable(items) ? items() : items
    const dictDefinition: Omit<DictType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'dict',
        ...options,
        properties: expanded,
    })
    return { ...dictDefinition, [schema.uuid]: uuid() }
}

// #endregion

// #region Tuple

export interface TupleOptions<Types = ThereforeTypes | ThereforeTypesExpandable> {
    [schema.type]: 'tuple'
    [schema.uuid]: string
    items: Types[]
    names?: string[]
}
export type TupleType = TupleOptions<ThereforeTypes> & ThereforeCommon<Json[]>

export function $tuple(
    items: (ThereforeTypes | ThereforeTypesExpandable)[] | Record<string, ThereforeTypes | ThereforeTypesExpandable>,
    options: SchemaOptions<TupleType, 'items' | 'names'> = {}
): TupleType {
    const expanded: ThereforeTypes[] = (Array.isArray(items) ? items : Object.values(items)).map((v) =>
        isExpandable(v) ? v() : v
    )
    const tupleDefinition: Omit<TupleType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'tuple',
        ...options,
        items: expanded,
        names: Array.isArray(items) ? undefined : Object.keys(items),
    })
    return { ...tupleDefinition, [schema.uuid]: uuid() }
}

// #endregion

// #region Ref

export interface RefOptions {
    [schema.type]: '$ref'
    [schema.uuid]: string
    reference: ThereforeTypes | (() => ThereforeTypes)
    name: string
}

export type RefType = RefOptions & ThereforeCommon<Json>

const refProperties: OptionKeys<RefType, 'reference' | 'name'> = {
    ...commonOptions,
}

function refFunction(
    reference: SchemaOptions<RefType, 'reference' | 'name'> | Record<string, ThereforeTypes | (() => ThereforeTypes)>,
    options: SchemaOptions<RefType, 'reference' | 'name'> = {}
): Readonly<RefType> {
    const entries = Object.entries(reference)

    const filteredReferences = entries.filter(([_, v]) => isShorthand(v) || typeof v === 'function') as [
        string,
        ThereforeTypes | (() => ThereforeTypes)
    ][]
    const annotations: SchemaOptions<RefType, 'reference' | 'name'> = Object.fromEntries(
        entries.filter(([k, v]) => (objectProperties as Record<string, unknown>)[k] !== undefined && !isShorthand(v))
    )

    const first = filteredReferences[0]
    if (first === undefined) {
        throw new Error('no reference found')
    }

    const [name, ref] = first
    const refDefinition: RefType = filterUndefined({
        [schema.type]: '$ref',
        [schema.uuid]: uuid(),
        ...annotations,
        ...options,
        reference: ref,
        name,
    })
    return refDefinition
}
type RefInterface = OptionKeys<RefType, 'reference' | 'name'> & typeof refFunction

export const $ref: RefInterface = Object.assign(refFunction, refProperties)

// #endregion

// #region Union

export interface UnionOptions {
    [schema.type]: 'union'
    [schema.uuid]: string
    union: ReadonlyArray<ThereforeTypes>
}
export type UnionType = UnionOptions & ThereforeCommon<Json>

export function $union(
    union: ReadonlyArray<ThereforeTypes | ThereforeTypesExpandable>,
    options: SchemaOptions<UnionType, 'union'> = {}
): Readonly<UnionType> {
    const expanded: ReadonlyArray<ThereforeTypes> = union.map((v) => (isExpandable(v) ? v() : v))

    const unionDefinition: UnionType = filterUndefined({
        [schema.type]: 'union',
        [schema.uuid]: uuid(),
        ...options,
        union: expanded,
    })

    return unionDefinition
}

// #endregion

// #region Intersection

export interface IntersectionOptions<Types = ThereforeTypes> {
    [schema.type]: 'intersection'
    [schema.uuid]: string
    intersection: ReadonlyArray<Types>
}
export type IntersectionType = IntersectionOptions & ThereforeCommon<Json>

export function $intersection(
    intersection: ReadonlyArray<ThereforeTypes | ThereforeTypesExpandable>,
    options: SchemaOptions<IntersectionType, 'intersection'> = {}
): Readonly<IntersectionType> {
    const expanded: ReadonlyArray<ThereforeTypes> = intersection.map((v) => (isExpandable(v) ? v() : v))

    const intersectionDefinition: IntersectionType = filterUndefined({
        [schema.type]: 'intersection',
        [schema.uuid]: uuid(),
        ...options,
        intersection: expanded,
    })
    return intersectionDefinition
}

// #endregion
