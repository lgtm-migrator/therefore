import { JsonSchema } from './json'

export interface FileSymbol {
    name: string
    root: string
    schemaFile: string
    schema: JsonSchemaValidator
    tsDefinition: TypescriptDefinition
}

export interface FileDefinition {
    file: string
    jsonSchemaFiles: string[]
    symbols: FileSymbol[]
    dependencies: Record<string, string[]>
}

export interface TypescriptDefinition {
    references: { name: string; uuid: string }[]
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
