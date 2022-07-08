import type { MetaDescription, SchemaMeta, SchemaOptions, TypeDiscriminator } from '../types/base'
import { descriptionKeys } from '../types/base'

import { omit, omitUndefined, pick } from '@zefiros-software/axioms'
import { v4 as uuid } from 'uuid'

export type CstSubNode = CstNode | (() => CstNode)

export interface CstNode<D extends string = string, I = unknown, T = unknown, C extends readonly any[] = unknown[]> {
    name?: string
    uuid: string
    type: D
    value: I
    description: SchemaMeta<T>
    children: C
}

export function cstNode<D extends TypeDiscriminator, O, T>(type: D, options: SchemaOptions<O, T>): CstNode<D, O, T, never>
export function cstNode<D extends TypeDiscriminator, O, T, C extends readonly unknown[]>(
    type: D,
    options: SchemaOptions<O, T>,
    children?: C,
    name?: string
): CstNode<D, O, T, C>
export function cstNode<D extends TypeDiscriminator, O, T, C extends readonly unknown[]>(
    type: D,
    options: SchemaOptions<O, T>,
    children?: C,
    name?: string
): CstNode<D, O, T, C> {
    return omitUndefined({
        uuid: uuid(),
        type,
        value: omit(options, descriptionKeys) as unknown as O,
        description: pick(options, descriptionKeys) as MetaDescription<T>,
        children,
        name: name ?? options.name,
    })
}
