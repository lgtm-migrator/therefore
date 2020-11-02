import { filterUndefined } from '../util'
import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

interface BaseBooleanOptions {
    /**
     * @internal
     */
    [schema.type]: 'boolean'
}

type InternalBooleanType = BaseBooleanOptions & ThereforeCommon<boolean>

/**
 * @category $boolean
 */
export interface BooleanType extends InternalBooleanType {}

/**
 *
 * @param options - additional options to pass to the property
 *
 * @example
 *      $object({
 *          isUser: $boolean(),
 *          flagged: $boolean
 *      })
 *
 * @category $boolean
 * @public
 */
export function $boolean(options: SchemaOptions<BooleanType> = {}): Readonly<BooleanType> {
    const booleanDefinition: BooleanType = filterUndefined({
        [schema.type]: 'boolean',
        [schema.uuid]: uuid(),
        ...options,
    })
    return booleanDefinition
}
