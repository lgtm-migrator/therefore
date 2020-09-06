import { filterUndefined } from '../util'
import { schema, SchemaOptions, ThereforeCommon } from '../therefore'

import { v4 as uuid } from 'uuid'

export interface IntegerOptions {
    [schema.type]: 'integer'
    [schema.uuid]: string
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number
    minimum?: number
    exclusiveMinimum?: number
}

export type IntegerType = IntegerOptions & ThereforeCommon<number>

export const $integer = (options: SchemaOptions<IntegerType> = {}): Readonly<IntegerType> => {
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
