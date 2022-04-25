import type { CstNode, CstSubNode } from '../../cst/cst'
import { cstNode } from '../../cst/cst'
import type { SchemaOptions } from '../base'

import type { EmptyObj, IsUnion } from '@zefiros-software/axioms'
import { omit, valuesOf, isArray, entriesOf, isTuple } from '@zefiros-software/axioms'

type SingleKey<T> = IsUnion<keyof T> extends true ? never : EmptyObj extends T ? never : T

export interface RefOptions {}

export type RefType = CstNode<'ref', RefOptions, unknown, readonly [string, CstSubNode]>

export function isCombinedDefinition<T extends Record<string, CstSubNode>>(
    x: SingleKey<T> | [string, CstSubNode] | (SchemaOptions<RefOptions> & { reference: SingleKey<T> | [string, CstSubNode] })
): x is SchemaOptions<RefOptions> & { reference: SingleKey<T> | [string, CstSubNode] } {
    return !isTuple(2, x) && valuesOf(x).length !== 1
}

export function $ref<T extends Record<string, CstSubNode>>(
    reference: SchemaOptions<RefOptions> & { reference: SingleKey<T> | [string, CstSubNode] }
): RefType
export function $ref<T extends Record<string, CstSubNode>>(
    reference: SingleKey<T> | [string, CstSubNode],
    options?: SchemaOptions<RefOptions>
): RefType
export function $ref<T extends Record<string, CstSubNode>>(
    reference:
        | SingleKey<T>
        | [string, CstSubNode]
        | (SchemaOptions<RefOptions> & { reference: SingleKey<T> | [string, CstSubNode] }),
    options: SchemaOptions<RefOptions> = {}
): RefType {
    if (isCombinedDefinition(reference)) {
        const ref: readonly [string, CstSubNode] = isArray(reference.reference)
            ? [reference.reference[0], reference.reference[1]]
            : entriesOf(reference.reference).map(([name, node]) => [name, node] as const)[0]
        return cstNode('ref', omit(['reference'], reference), ref)
    }
    const ref: readonly [string, CstSubNode] = isArray(reference)
        ? [reference[0], reference[1]]
        : entriesOf(reference).map(([name, node]) => [name, node] as const)[0]
    return cstNode('ref', options, ref)
}
