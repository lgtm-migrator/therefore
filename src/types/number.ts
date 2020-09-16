import { filterUndefined } from '../util'
import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

export interface NumberOptions {
    [schema.type]: 'number'
    [schema.uuid]: string
    multipleOf?: number
    maximum?: number
    exclusiveMaximum?: number
    minimum?: number
    exclusiveMinimum?: number
}

export type NumberType = NumberOptions & ThereforeCommon<number>

export const $number = (options: SchemaOptions<NumberType> = {}): Readonly<NumberType> => {
    const numberDefinition: NumberType = filterUndefined({
        [schema.type]: 'number',
        [schema.uuid]: uuid(),
        multipleOf: undefined,
        maximum: undefined,
        exclusiveMaximum: undefined,
        minimum: undefined,
        exclusiveMinimum: undefined,
        ...options,
    })
    return numberDefinition
}
