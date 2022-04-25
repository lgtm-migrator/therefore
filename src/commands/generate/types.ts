import type { TypescriptDefinition } from '../../definition'

export type ThereforeOutputType = 'jsonschema' | 'typescript' | 'validator'

export interface FileSymbol {
    symbolName: string
    schemaFile?: string
    compiledFile?: string
    definition: TypescriptDefinition
    typeOnly: boolean
}

export interface FileDefinition {
    file: string
    attachedFiles: { file: string; content: string; prettify: boolean; type: ThereforeOutputType }[]
    symbols: FileSymbol[]
    dependencies: Record<string, string[] | undefined>
}
