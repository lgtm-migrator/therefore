import { filterUndefined } from '../util'
import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

export interface NullOptions {
    /**
     * @internal
     */
    [schema.type]: 'null'
}

type InternalNullType = NullOptions & ThereforeCommon<null>

/**
 * @category $null
 */
export interface NullType extends InternalNullType {}

/**
 *
 * @param options - additional options to pass to the property
 *
 * @category $null
 */
export function $null(options: SchemaOptions<NullType> = {}): Readonly<NullType> {
    const nullDefinition: NullType = filterUndefined({
        [schema.type]: 'null',
        [schema.uuid]: uuid(),
        ...options,
    })
    return nullDefinition
}
