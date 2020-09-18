/**
 * Generated by @zefiros/therefore@v0.0.1
 * Do not manually touch this
 */

/* eslint-disable */
import iconSchema from './schemas/icon.schema.json'

import AjvValidator from 'ajv'

export type Uri = string

export type Icon = Uri

export const Icon = {
    schema: iconSchema,
    validate:
        typeof iconSchema === 'function'
            ? iconSchema
            : (new AjvValidator().compile(iconSchema) as {
                  (o: unknown | Icon): o is Icon
                  errors?: null | Array<import('ajv').ErrorObject>
              }),
    is: (o: unknown | Icon): o is Icon => Icon.validate(o) === true,
    assert: (o: unknown | Icon): asserts o is Icon => {
        if (!Icon.validate(o)) {
            throw new AjvValidator.ValidationError(Icon.validate.errors ?? [])
        }
    },
}
