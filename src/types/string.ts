import { schema, ThereforeCommon } from '../therefore'
import { filterUndefined } from '../util'
import { JsonStringInstance } from '../json'

export interface StringOptions {
    [schema.type]: 'string'
    minLength?: number
    maxLength?: number
    pattern?: string | RegExp
    format?: JsonStringInstance['format']
}

export type StringType = StringOptions & ThereforeCommon<string>

export const $string = (options: Partial<StringType> = {}): Readonly<StringType> => {
    const stringDefinition: StringType = filterUndefined({
        [schema.type]: 'string',
        minLength: undefined,
        maxLength: undefined,
        pattern: undefined,
        ...options,
    })
    return stringDefinition
}
