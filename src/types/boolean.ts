import { filterUndefined } from '../util'
import { schema, ThereforeCommon } from '../therefore'

export interface BooleanOptions {
    [schema.type]: 'boolean'
}

export type BooleanType = BooleanOptions & ThereforeCommon<boolean>

export const $boolean = (options: Partial<BooleanType> = {}): Readonly<BooleanType> => {
    const booleanDefinition: BooleanType = filterUndefined({
        [schema.type]: 'boolean',
        ...options,
    })
    return booleanDefinition
}
