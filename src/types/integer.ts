import { filterUndefined } from '../util'
import { schema, ThereforeCommon } from '../therefore'

export interface IntegerOptions {
    [schema.type]: 'integer'
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number
    minimum?: number
    exclusiveMinimum?: number
}

export type IntegerType = IntegerOptions & ThereforeCommon<number>

export const $integer = (options: Partial<IntegerType> = {}): Readonly<IntegerType> => {
    const integerDefinition: IntegerType = filterUndefined({
        [schema.type]: 'integer',
        multipleOf: undefined,
        maximum: undefined,
        exclusiveMaximum: undefined,
        minimum: undefined,
        exclusiveMinimum: undefined,
        ...options,
    })
    return integerDefinition
}
