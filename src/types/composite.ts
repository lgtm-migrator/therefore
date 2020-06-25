import { $boolean } from './boolean'
import { EnumType } from './enum'
import { $integer } from './integer'
import { $null } from './null'
import { $number } from './number'
import { $string } from './string'
import { $unknown } from './unknown'

import { Json, schema, ThereforeCommon } from '../therefore'
import { filterUndefined } from '../util'

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

export function isExpandable(v: ThereforeTypesExpandable | ThereforeTypes | undefined): v is ThereforeTypesExpandable {
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
}
export type ObjectType = ObjectOptions<ThereforeTypes> & ThereforeCommon<{ [property: string]: Json }>

export function $object(properties?: ObjectProperties, options: Partial<Omit<ObjectType, 'properties'>> = {}): ObjectType {
    const expanded: ObjectProperties<ThereforeTypes> = Object.fromEntries(
        Object.entries(properties ?? []).map(([k, v]) => (isExpandable(v) ? [k, v()] : [k, v]))
    )

    const objectDefinition: Omit<ObjectType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'object',
        ...options,
        properties: expanded,
    })
    return { ...objectDefinition, [schema.uuid]: uuid() }
}

// #endregion

// #region Arrays

export interface ArrayOptions<Types = ThereforeTypes | ThereforeTypesExpandable> {
    [schema.type]: 'array'
    [schema.uuid]: string
    items: Types
}
export type ArrayType = ArrayOptions<ThereforeTypes> & ThereforeCommon<Json[]>

export function $array(
    items: ThereforeTypes | ThereforeTypesExpandable,
    options: Partial<Omit<ArrayType, 'items'>> = {}
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
    options: Partial<Omit<DictType, 'properties'>> = {}
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
    options: Partial<Omit<TupleType, 'items' | 'names'>> = {}
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
    reference: ObjectType | DictType | EnumType
    name: string
}

export type RefType = RefOptions & ThereforeCommon<null>

export function $ref(
    reference: Record<string, ObjectType | DictType | EnumType>,
    options: Partial<RefType> = {}
): Readonly<RefType> {
    const [name, ref] = Object.entries(reference)[0]
    const refDefinition: RefType = filterUndefined({
        [schema.type]: '$ref',
        reference: ref,
        name,
        ...options,
    })
    return refDefinition
}

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
    options: Partial<Omit<UnionType, 'union'>> = {}
): Readonly<UnionType> {
    const expanded: ReadonlyArray<ThereforeTypes> = union.map((v) => (isExpandable(v) ? v() : v))

    const unionDefinition: Omit<UnionType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'union',
        ...options,
        union: expanded,
    })
    return { ...unionDefinition, [schema.uuid]: uuid() }
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
    options: Partial<Omit<IntersectionType, 'intersection'>> = {}
): Readonly<IntersectionType> {
    const expanded: ReadonlyArray<ThereforeTypes> = intersection.map((v) => (isExpandable(v) ? v() : v))

    const intersectionDefinition: Omit<IntersectionType, typeof schema.uuid> = filterUndefined({
        [schema.type]: 'intersection',
        ...options,
        intersection: expanded,
    })
    return { ...intersectionDefinition, [schema.uuid]: uuid() }
}

// #endregion
