import { schema } from './therefore'
import type {
    ThereforeTypes,
    ObjectType,
    DictType,
    ArrayType,
    TupleType,
    RefType,
    UnionType,
    IntersectionType,
} from './types/composite'
import type { EnumType } from './types/enum'

export function isEnum(obj: ThereforeTypes | { [schema.type]: string }): obj is EnumType {
    return obj[schema.type] === 'enum'
}

export function isObject(obj: ThereforeTypes | { [schema.type]: string }): obj is ObjectType {
    return obj[schema.type] === 'object'
}

export function isDict(obj: ThereforeTypes | { [schema.type]: string }): obj is DictType {
    return obj[schema.type] === 'dict'
}

export function isArray(obj: ThereforeTypes | { [schema.type]: string }): obj is ArrayType {
    return obj[schema.type] === 'array'
}

export function isTuple(obj: ThereforeTypes | { [schema.type]: string }): obj is TupleType {
    return obj[schema.type] === 'tuple'
}

export function isRef(obj: ThereforeTypes | { [schema.type]: string }): obj is RefType {
    return obj[schema.type] === '$ref'
}

export function isUnion(obj: ThereforeTypes | { [schema.type]: string }): obj is UnionType {
    return obj[schema.type] === 'union'
}

export function isIntersection(obj: ThereforeTypes | { [schema.type]: string }): obj is IntersectionType {
    return obj[schema.type] === 'intersection'
}

export function isShorthand(obj: unknown | ThereforeTypes | { [schema.type]: string }): obj is ThereforeTypes {
    return (obj as Record<string, unknown> | undefined)?.[schema.type] !== undefined
}

export function isExportable(
    obj: unknown | ThereforeTypes
): obj is TupleType | DictType | ObjectType | EnumType | UnionType | IntersectionType {
    return isShorthand(obj) //&&(isTuple(obj) || isDict(obj) || isObject(obj) || isEnum(obj) || isRef(obj) || isUnion(obj) || isIntersection(obj))
}
