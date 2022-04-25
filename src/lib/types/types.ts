import type { ArrayType } from './array'
import type { BooleanType } from './boolean'
import type { DictType } from './dict'
import type { EnumType } from './enum'
import type { IntegerType } from './integer'
import type { NullType } from './null'
import type { NumberType } from './number'
import type { ObjectType } from './object'
import type { RefType } from './ref'
import type { StringType } from './string'
import type { TupleType } from './tuple'
import type { UnionType } from './union'
import type { UnknownType } from './unknown'

export type ThereforeCst =
    | ArrayType
    | BooleanType
    | DictType
    | EnumType
    | IntegerType
    | NullType
    | NumberType
    | ObjectType
    | RefType
    | StringType
    | TupleType
    | UnionType
    | UnknownType
