import type { JsonSchema } from './json'
import type { CstSubNode } from './lib/cst/cst'
import type { RefType } from './lib/types'

import type { ValidateFunction } from 'ajv'

export interface TypescriptReference {
    name: string
    referenceName: string
    uuid: string
    reference: RefType['children']
}

export interface TypescriptDefinition {
    references: TypescriptReference[]
    sourceSymbol: string
    symbolName: string
    uuid: string
    referenceName: string
    declaration: string
    schema: CstSubNode
    isExported: boolean
    locals?: Record<string, TypescriptDefinition>
}

export type JsonSchemaValidator =
    | {
          compiled: true
          validator: ValidateFunction
          code: string
          schema: JsonSchema
      }
    | {
          compiled?: false
          schema: JsonSchema
          validator?: ValidateFunction
          code?: string
      }
