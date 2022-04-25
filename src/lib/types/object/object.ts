import type { CstNode, CstSubNode } from '../../cst/cst'
import { cstNode } from '../../cst/cst'
import { isThereforeExport } from '../../guard'
import type { SchemaOptions } from '../base'

import type { Dict, RequireKeys } from '@zefiros-software/axioms'
import { valuesOf, omit, all, entriesOf, evaluate } from '@zefiros-software/axioms'

export type ObjectPropertiesArg = Record<string, CstSubNode>

export interface ObjectOptions {
    /** @deprecated */
    minProperties?: number
    /** @deprecated */
    maxProperties?: number
}

export type ObjectType = CstNode<'object', ObjectOptions, unknown, RequireKeys<CstNode, 'name'>[]>

export function isCombinedDefinition(
    x?: Dict | (SchemaOptions<ObjectOptions> & { properties: ObjectPropertiesArg })
): x is SchemaOptions<ObjectOptions> & { properties: ObjectPropertiesArg } {
    return x !== undefined && 'properties' in x && !all(isThereforeExport, valuesOf(x))
}

export function $object(properties: SchemaOptions<ObjectOptions> & { properties: ObjectPropertiesArg }): ObjectType
export function $object(properties?: ObjectPropertiesArg, options?: SchemaOptions<ObjectOptions>): ObjectType
export function $object(
    properties?: ObjectPropertiesArg | (SchemaOptions<ObjectOptions> & { properties: ObjectPropertiesArg }),
    options: SchemaOptions<ObjectOptions> = {}
): ObjectType {
    if (isCombinedDefinition(properties)) {
        return cstNode(
            'object',
            omit(['properties'], properties),
            entriesOf(properties.properties).map(([name, node]) => ({ name, ...evaluate(node) }))
        )
    }
    return cstNode(
        'object',
        options,
        entriesOf(properties ?? {}).map(([name, node]) => ({ name, ...evaluate(node) }))
    )
}
