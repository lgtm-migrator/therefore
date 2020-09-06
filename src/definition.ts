import { JsonSchema } from './json'
import { RefType } from './types/composite'

export interface FileSymbol {
    name: string
    //root: string
    schemaFile?: string
    //schema: JsonSchemaValidator
    tsDefinition: TypescriptDefinition
}

export interface FileDefinition {
    file: string
    jsonFiles: { file: string; schema: string }[]
    symbols: FileSymbol[]
    dependencies: Record<string, string[] | undefined>
}

export interface TypescriptReference {
    name: string
    referenceName: string
    uuid: string
    reference: RefType['reference']
}

export interface TypescriptDefinition {
    references: TypescriptReference[]
    symbolName: string
    uuid: string
    interfaceName: string
    referenceName: string
    declaration: string
    meta?: string
}

export interface JsonSchemaValidator {
    schema: JsonSchema
}
