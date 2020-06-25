import { filterUndefined } from '../util'
import { schema, ThereforeCommon } from '../therefore'

export interface NumberOptions {
    [schema.type]: 'number'
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number
    minimum?: number
    exclusiveMinimum?: number
}

export type NumberType = NumberOptions & ThereforeCommon<number>

export const $number = (options: Partial<NumberType> = {}): Readonly<NumberType> => {
    const numberDefinition: NumberType = filterUndefined({
        [schema.type]: 'number',
        multipleOf: undefined,
        maximum: undefined,
        exclusiveMaximum: undefined,
        minimum: undefined,
        exclusiveMinimum: undefined,
        ...options,
    })
    return numberDefinition
}
