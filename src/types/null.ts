import { filterUndefined } from '../util'
import { schema, ThereforeCommon } from '../therefore'

export interface NullOptions {
    [schema.type]: 'null'
}

export type NullType = NullOptions & ThereforeCommon<null>

export const $null = (options: Partial<NullType> = {}): Readonly<NullType> => {
    const nullDefinition: NullType = filterUndefined({
        [schema.type]: 'null',
        ...options,
    })
    return nullDefinition
}
