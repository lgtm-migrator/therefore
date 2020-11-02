import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'
import { filterUndefined } from '../util'
import type { JsonStringInstance } from '../json'

import { v4 as uuid } from 'uuid'

interface BaseStringOptions {
    /**
     * @internal
     */
    [schema.type]: 'string'
    minLength?: number
    maxLength?: number
    pattern?: string | RegExp
    format?: JsonStringInstance['format']
}

type InternalStringType = BaseStringOptions & ThereforeCommon<string>

/**
 * @category $string
 */
export interface StringType extends InternalStringType {}

/**
 *
 * @param options - additional options to pass to the property
 *
 * @category $string
 */
export function $string(options: SchemaOptions<StringType> = {}): Readonly<StringType> {
    const stringDefinition: StringType = filterUndefined({
        [schema.type]: 'string',
        [schema.uuid]: uuid(),
        minLength: undefined,
        maxLength: undefined,
        pattern: undefined,
        ...options,
    })
    return stringDefinition
}
