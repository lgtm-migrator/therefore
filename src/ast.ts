import { schema } from './therefore'
import type { BooleanType } from './types/boolean'
import type {
    ArrayType,
    DictType,
    IntersectionType,
    ObjectType,
    RefType,
    ThereforeTypes,
    TupleType,
    UnionType,
} from './types/composite'
import type { EnumType } from './types/enum'
import type { IntegerType } from './types/integer'
import type { NullType } from './types/null'
import type { NumberType } from './types/number'
import type { StringType } from './types/string'
import type { UnknownType } from './types/unknown'

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

export function prepass(obj: ThereforeTypes & { prepass?: true }): ThereforeTypes & { prepass?: true } {
    const prepassVisitor: GraphVisitor<ThereforeTypes> = {
        union: (node) => {
            return { ...node, union: node.union.map((i) => walkGraph(i, prepassVisitor)) }
        },
        intersection: (node) => {
            return { ...node, intersection: node.intersection.map((i) => walkGraph(i, prepassVisitor)) }
        },
        object: (node) => {
            const properties: typeof node['properties'] = {}
            for (const [key, value] of Object.entries(node.properties)) {
                properties[key] = walkGraph(value, prepassVisitor)
            }
            return { ...node, properties }
        },
        array: (node) => {
            return { ...node, items: walkGraph(node.items, prepassVisitor) }
        },
        tuple: (node) => {
            return { ...node, items: node.items.map((i) => walkGraph(i, prepassVisitor)) }
        },
        dict: (node) => {
            return { ...node, additionalProperties: walkGraph(node.properties, prepassVisitor) }
        },
        $ref: (node: RefType) => ({
            ...node,
            // fix the functions to the evaluated format
            reference: typeof node.reference === 'function' ? node.reference() : node.reference,
        }),
        _: (node: ThereforeTypes) => node,
    }
    if (obj.prepass !== true) {
        return { ...walkGraph(obj, prepassVisitor), prepass: true }
    }
    return obj
}
