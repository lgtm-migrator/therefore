import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'
import { filterUndefined } from '../util'
import type { JsonStringInstance } from '../json'

import { v4 as uuid } from 'uuid'

export interface StringOptions {
    [schema.type]: 'string'
    [schema.uuid]: string
    minLength?: number
    maxLength?: number
    pattern?: string | RegExp
    format?: JsonStringInstance['format']
}

export type StringType = StringOptions & ThereforeCommon<string>

export const $string = (options: SchemaOptions<StringType> = {}): Readonly<StringType> => {
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
