import type { CstNode } from './cst/cst'
import type { ThereforeCst } from './types/types'

import type { RequireKeys } from '@zefiros-software/axioms'
import { isArray, isObject } from '@zefiros-software/axioms'

export function isNamedArray<T>(x: [name: string, node: T][] | T[]): x is [name: string, node: T][] {
    return x.length > 0 && isArray(x[0]) && x[0].length === 2
}

export function isNamedCstNodeArray<T extends CstNode>(
    x: Omit<T, 'name'>[] | RequireKeys<T, 'name'>[]
): x is RequireKeys<T, 'name'>[] {
    return x.length > 0 && 'name' in x[0] && x[0] !== undefined
}

export function isThereforeExport(x: ThereforeCst | unknown): x is ThereforeCst {
    return isObject(x) && 'type' in x && 'uuid' in x && 'value' in x && 'description' in x
}

export function isCstNode(x: unknown): x is CstNode {
    return isObject(x) && 'type' in x && 'uuid' in x && 'value' in x && 'description' in x
}
