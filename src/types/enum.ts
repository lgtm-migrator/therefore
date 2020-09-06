import { Json, schema, SchemaOptions, ThereforeCommon } from '../therefore'
import { filterUndefined } from '../util'

import { v4 as uuid } from 'uuid'

export interface EnumOptions {
    [schema.type]: 'enum'
    [schema.uuid]: string
    values: ReadonlyArray<Json>
    names?: ReadonlyArray<string>
}
export type EnumType<T extends Json = Json> = EnumOptions & ThereforeCommon<T>
export const $enum = <T extends Json, U extends Json>(
    values: ReadonlyArray<T> | Record<string, T>,
    options: SchemaOptions<EnumType<U & T>, typeof schema.type> = {}
): Readonly<EnumType> => {
    const enumDefinition: EnumType = filterUndefined({
        [schema.type]: 'enum',
        [schema.uuid]: uuid(),
        values: Array.isArray(values) ? values : Object.values(values),
        names: Array.isArray(values) ? undefined : Object.keys(values),
        ...options,
    })
    return enumDefinition
}
