/**
 * Generated by @zefiros-software/therefore@v0.0.1
 * Do not manually touch this
 */
/* eslint-disable */
import AjvValidator from 'ajv'
import type { ValidateFunction } from 'ajv'

export type Json =
    | string
    | null
    | boolean
    | number
    | {
          [k: string]: Json | undefined
      }
    | Json[]

export const Json = {
    validate: require('./schemas/json.schema.js') as ValidateFunction<Json>,
    get schema() {
        return Json.validate.schema
    },
    source: `${__dirname}json.schema`,
    sourceSymbol: 'json',
    is: (o: unknown): o is Json => Json.validate(o) === true,
    assert: (o: unknown) => {
        if (!Json.validate(o)) {
            throw new AjvValidator.ValidationError(Json.validate.errors ?? [])
        }
    },
} as const

export type JsonAdv = JsonLocal

export const JsonAdv = {
    validate: require('./schemas/json-adv.schema.js') as ValidateFunction<JsonAdv>,
    get schema() {
        return JsonAdv.validate.schema
    },
    source: `${__dirname}json.schema`,
    sourceSymbol: 'jsonAdv',
    is: (o: unknown): o is JsonAdv => JsonAdv.validate(o) === true,
    assert: (o: unknown) => {
        if (!JsonAdv.validate(o)) {
            throw new AjvValidator.ValidationError(JsonAdv.validate.errors ?? [])
        }
    },
} as const

type JsonLocal =
    | string
    | null
    | boolean
    | number
    | {
          [k: string]: JsonAdv | undefined
      }
    | JsonAdv[]
