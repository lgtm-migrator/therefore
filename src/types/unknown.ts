import { filterUndefined } from '../util'
import { schema, SchemaOptions, ThereforeCommon } from '../therefore'

import { v4 as uuid } from 'uuid'

export interface UnknownOptions {
    [schema.type]: 'unknown'
    [schema.uuid]: string
}

export type UnknownType = UnknownOptions & ThereforeCommon

export const $unknown = (options: SchemaOptions<UnknownType> = {}): Readonly<UnknownType> => {
    const unknownDefinition: UnknownType = filterUndefined({
        [schema.type]: 'unknown',
        [schema.uuid]: uuid(),
        ...options,
    })
    return unknownDefinition
}
