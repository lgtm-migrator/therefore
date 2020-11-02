import type { Json, SchemaOptions, ThereforeCommon } from '../therefore'
import { schema } from '../therefore'
import { filterUndefined } from '../util'

import { v4 as uuid } from 'uuid'

interface EnumOptions<T> {
    /**
     * @internal
     */
    [schema.type]: 'enum'

    /**
     * The values that are allowed on this property.
     *
     * @internal
     */
    values: ReadonlyArray<T>

    /**
     * The readable names associated with the values.
     *
     * @internal
     */
    names?: ReadonlyArray<string>
}

type InternalEnumType<T extends Json = Json> = EnumOptions<T> & ThereforeCommon<T>

/**
 * @category $enum
 */
export interface EnumType<T extends Json = Json> extends InternalEnumType<T> {}

/**
 * Declares an enum type. This is either a list of values, or a dictionary
 * where the key is the name of value.
 *
 * @param values - the values that are allowed on this property
 * @param options - additional options to pass to the property
 *
 * @example
 *      $enum([1, 2, 3])
 *
 * @example
 *      $enum({
 *          one: 1,
 *          two: 2,
 *          three: 3
 *      })
 *
 * @category $enum
 */
export function $enum<T extends Json>(
    values: ReadonlyArray<T> | Record<string, T>,
    options: SchemaOptions<EnumType<T>, 'values' | 'names'> = {}
): Readonly<EnumType<T>> {
    const enumDefinition: EnumType<T> = filterUndefined({
        [schema.type]: 'enum',
        [schema.uuid]: uuid(),
        values: Array.isArray(values) ? values : Object.values(values),
        names: Array.isArray(values) ? undefined : Object.keys(values),
        ...options,
    })
    return enumDefinition
}
