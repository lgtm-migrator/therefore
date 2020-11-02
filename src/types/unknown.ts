import { filterUndefined } from '../util'
import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

interface BaseUnknownOptions {
    [schema.type]: 'unknown'
}

type InternalUnknownType = BaseUnknownOptions & ThereforeCommon

/**
 * @category $unknown
 */
export interface UnknownType extends InternalUnknownType {}

/**
 *
 * @param options - additional options to pass to the property
 *
 * @category $unknown
 */
export function $unknown(options: SchemaOptions<UnknownType> = {}): Readonly<UnknownType> {
    const unknownDefinition: UnknownType = filterUndefined({
        [schema.type]: 'unknown',
        [schema.uuid]: uuid(),
        ...options,
    })
    return unknownDefinition
}
