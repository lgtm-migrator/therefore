import { schema } from './therefore'
import { BooleanType } from './types/boolean'
import {
    ArrayType,
    DictType,
    IntersectionType,
    ObjectType,
    RefType,
    ThereforeTypes,
    TupleType,
    UnionType,
} from './types/composite'
import { EnumType } from './types/enum'
import { IntegerType } from './types/integer'
import { NullType } from './types/null'
import { NumberType } from './types/number'
import { StringType } from './types/string'
import { UnknownType } from './types/unknown'

export interface GraphVisitor<R, C = void> {
    string?: (node: StringType, context: C) => R
    number?: (node: NumberType, context: C) => R
    integer?: (node: IntegerType, context: C) => R
    boolean?: (node: BooleanType, context: C) => R
    null?: (node: NullType, context: C) => R
    unknown?: (node: UnknownType, context: C) => R
    enum?: (node: EnumType, context: C) => R
    object?: (node: ObjectType, context: C) => R
    array?: (node: ArrayType, context: C) => R
    tuple?: (node: TupleType, context: C) => R
    dict?: (node: DictType, context: C) => R
    $ref?: (node: RefType, context: C) => R
    union?: (node: UnionType, context: C) => R
    intersection?: (node: IntersectionType, context: C) => R
    _: (node: ThereforeTypes, context: C) => R
}

export function walkGraph<R>(obj: ThereforeTypes, walker: GraphVisitor<R, void>, context?: void): R
export function walkGraph<R, C>(obj: ThereforeTypes, walker: GraphVisitor<R, C>, context: C): R
export function walkGraph<R, C = void>(obj: ThereforeTypes, walker: GraphVisitor<R, C>, context?: C | void): R {
    const type = obj[schema.type]
    const tryMethod: ((node: ThereforeTypes, context: C | void) => R) | undefined = walker?.[type] as (node: ThereforeTypes) => R
    const method = tryMethod ?? walker._
    return method?.(obj, context)
}
