import { filterUndefined } from '../util'
import type { SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'

import { v4 as uuid } from 'uuid'

export interface BooleanOptions {
    [schema.type]: 'boolean'
    [schema.uuid]: string
}

export type BooleanType = BooleanOptions & ThereforeCommon<boolean>

export const $boolean = (options: SchemaOptions<BooleanType> = {}): Readonly<BooleanType> => {
    const booleanDefinition: BooleanType = filterUndefined({
        [schema.type]: 'boolean',
        [schema.uuid]: uuid(),
        ...options,
    })
    return booleanDefinition
}
