import { filterUndefined } from '../util'
import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

interface BaseIntegerOptions {
    /**
     * @internal
     */
    [schema.type]: 'integer'

    /**
     * The resulting property will only be valid when the value divided by this parameter
     * results in a strict integer. (exluding zero)
     *
     * @example
     * Given `$integer({multipleOf: 0.2})`
     *
     *  - input: 10 -> 10 / 0.2 = 50 (validates)
     *  - input: 10.5 -> 10.5 / 0.2 = 52.5 (invalid)
     */
    multipleOf?: number

    /**
     * A number is valid if the value is lower than or equal to the parameter.
     *
     * @example
     * Given `$integer({maximum: 1.0})`
     *
     *  - input: 1 (validates)
     *  - input: 2 (invalid)
     */
    maximum?: number

    /**
     * A number is valid if the value is lower than the parameter.
     *
     * @example
     * Given `$integer({exclusiveMaximum: 1.0})`
     *
     *  - input: 0 (validates)
     *  - input: 1 (invalid)
     *  - input: 2 (invalid)
     */
    exclusiveMaximum?: number

    /**
     * A number is valid if the value is greater than or equal to the parameter.
     *
     * @example
     * Given `$integer({minimum: 1.0})`
     *
     *  - input: 0 (invalid)
     *  - input: 1 (validates)
     */
    minimum?: number

    /**
     * A number is valid if the value is greater than or equal to the parameter.
     *
     * @example
     * Given `$integer({exclusiveMinimum: 1.0})`
     *
     *  - input: 0 (invalid)
     *  - input: 1 (invalid)
     *  - input: 2 (validates)
     */
    exclusiveMinimum?: number
}

type InternalIntegerType = BaseIntegerOptions & ThereforeCommon<number>

/**
 * @category $integer
 */
export interface IntegerType extends InternalIntegerType {}

/**
 *
 * @param options - additional options to pass to the property
 *
 * @category $integer
 */
export function $integer(options: SchemaOptions<IntegerType> = {}): Readonly<IntegerType> {
    const integerDefinition: IntegerType = filterUndefined({
        [schema.type]: 'integer',
        [schema.uuid]: uuid(),
        multipleOf: undefined,
        maximum: undefined,
        exclusiveMaximum: undefined,
        minimum: undefined,
        exclusiveMinimum: undefined,
        ...options,
    })
    return integerDefinition
}
