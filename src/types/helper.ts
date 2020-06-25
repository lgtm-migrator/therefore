import { isExpandable, ThereforeTypes, ThereforeTypesExpandable } from './composite'

import { schema } from '../therefore'

export function $optional(literal: ThereforeTypes | ThereforeTypesExpandable): ThereforeTypes & { [schema.optional]: true } {
    const expanded: ThereforeTypes = isExpandable(literal) ? literal() : literal
    return {
        ...expanded,
        [schema.optional]: true,
    }
}

export function $nullable(literal: ThereforeTypes | ThereforeTypesExpandable): ThereforeTypes & { [schema.nullable]: true } {
    const expanded: ThereforeTypes = isExpandable(literal) ? literal() : literal
    return {
        ...expanded,
        [schema.nullable]: true,
    }
}
