import { filterUndefined } from '../util'
import { schema, ThereforeCommon } from '../therefore'

export interface UnknownOptions {
    [schema.type]: 'unknown'
}

export type UnknownType = UnknownOptions & ThereforeCommon

export const $unknown = (options: Partial<UnknownType> = {}): Readonly<UnknownType> => {
    const unknownDefinition: UnknownType = filterUndefined({
        [schema.type]: 'unknown',
        ...options,
    })
    return unknownDefinition
}
