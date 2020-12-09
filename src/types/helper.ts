import type { ThereforeTypes, ThereforeTypesExpandable } from './composite'
import { isExpandable } from './composite'
import type { EnumType } from './enum'
import { $enum } from './enum'

import type { Json, SchemaOptions } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

export function $optional(literal: ThereforeTypes | ThereforeTypesExpandable): ThereforeTypes & { [schema.optional]: true } {
    const expanded: ThereforeTypes = isExpandable(literal) ? literal() : literal
    return {
        ...expanded,
        [schema.uuid]: uuid(),
        [schema.optional]: true,
    }
}

export function $nullable(literal: ThereforeTypes | ThereforeTypesExpandable): ThereforeTypes & { [schema.nullable]: true } {
    const expanded: ThereforeTypes = isExpandable(literal) ? literal() : literal
    return {
        ...expanded,
        [schema.uuid]: uuid(),
        [schema.nullable]: true,
    }
}

export function $const<T extends Json>(
    value: Readonly<T>,
    options: SchemaOptions<EnumType<T>, 'values' | 'names'> = {}
): Readonly<EnumType<T>> {
    return $enum<T>([value], options)
}
