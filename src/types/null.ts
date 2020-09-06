import { filterUndefined } from '../util'
import { schema, SchemaOptions, ThereforeCommon } from '../therefore'

import { v4 as uuid } from 'uuid'

export interface NullOptions {
    [schema.type]: 'null'
    [schema.uuid]: string
}

export type NullType = NullOptions & ThereforeCommon<null>

export const $null = (options: SchemaOptions<NullType> = {}): Readonly<NullType> => {
    const nullDefinition: NullType = filterUndefined({
        [schema.type]: 'null',
        [schema.uuid]: uuid(),
        ...options,
    })
    return nullDefinition
}
