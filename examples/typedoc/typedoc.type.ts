/**
 * Generated by @zefiros/therefore@v0.0.1
 * Do not manually touch this
 */

/* eslint-disable */
import typedocSchema from './schemas/typedoc.schema.json'

import AjvValidator from 'ajv'

/**
 * JSON Schema for typedoc.json
 */
export interface Typedoc {
    /**
     * Should TypeDoc disable the testing and cleaning of the output directory?
     *
     * @default false
     */
    disableOutputCheck: boolean
    /**
     * Specifies the fully qualified name of the root symbol.
     *
     * @default './'
     */
    entryPoint: string
    /**
     * Exclude files by the given pattern when a path is provided as source. Supports minimatch patterns.
     */
    exclude: string[]
    /**
     * Prevent externally resolved TypeScript files from being documented.
     *
     * @default false
     */
    excludeExternals: boolean
    /**
     * Prevent symbols that are not exported from being documented.
     *
     * @default false
     */
    excludeNotExported: boolean
    /**
     * Ignores private variables and methods
     *
     * @default false
     */
    excludePrivate: boolean
    /**
     * Ignores protected variables and methods
     *
     * @default false
     */
    excludeProtected: boolean
    /**
     * Define a pattern for files that should be considered being external.
     */
    externalPattern: string[]
    /**
     * Set the Google Analytics tracking ID and activate tracking code.
     */
    gaID: string
    /**
     * Set the site name for Google Analytics.
     *
     * @default 'auto'
     */
    gaSite: string
    /**
     * Use specified revision or branch instead of the last revision for linking to GitHub source files.
     */
    gitRevision: string
    /**
     * Do not print the TypeDoc link at the end of the page.
     *
     * @default false
     */
    hideGenerator: boolean
    /**
     * Generates documentation, even if the project does not TypeScript compile.
     *
     * @default false
     */
    ignoreCompilerErrors: boolean
    /**
     * Turn on parsing of .d.ts declaration files.
     *
     * @default false
     */
    includeDeclarations: boolean
    /**
     * Specifies the location to look for included documents (use [[include:FILENAME]] in comments).
     */
    includes: string
    /**
     * The sources files from which to build documentation.
     */
    inputFiles: string[]
    /**
     * Specifies the location to output a JSON file containing all of the reflection data.
     */
    json: string
    /**
     * Emits a list of broken symbol [[navigation]] links after documentation generation
     *
     * @default false
     */
    listInvalidSymbolLinks: boolean
    /**
     * Specify the logger that should be used.
     *
     * @default 'console'
     */
    logger: 'console' | 'none'
    /**
     * Specifies the location with media files that should be copied to the output directory.
     */
    media: string
    /**
     * Specifies the output mode the project is used to be compiled with.
     *
     * @default 'modules'
     */
    mode: 'file' | 'modules'
    /**
     * Set the name of the project that will be used in the header of the template.
     */
    name: string
    /**
     * Specifies the location the documentation should be written to.
     */
    out: string
    plugin: PluginLocal
    /**
     * Add the package version according to package.json to the projects name.
     *
     * @default false
     */
    includeVersion: boolean
    /**
     * Specify tags that should be removed from doc comments when parsing.
     *
     * @default []
     */
    excludeTags: string[]
    readme: ReadmeLocal
    src: SrcLocal
    /**
     * Remove reflections annotated with @internal
     *
     * @default false
     */
    stripInternal: boolean
    theme: ThemeLocal
    /**
     * Specifies the top level table of contents.
     */
    toc: string[]
    /**
     * Specify a typescript config file that should be loaded. If not specified TypeDoc will look for 'tsconfig.json' in the current directory.
     *
     * @default './tsconfig.json'
     */
    tsconfig: string
}

export const Typedoc = {
    schema: typedocSchema,
    validate:
        typeof typedocSchema === 'function'
            ? typedocSchema
            : (new AjvValidator().compile(typedocSchema) as {
                  (o: unknown | Typedoc): o is Typedoc
                  errors?: null | Array<import('ajv').ErrorObject>
              }),
    is: (o: unknown): o is Typedoc => Typedoc.validate(o) === true,
    assert: (o: unknown): asserts o is Typedoc => {
        if (!Typedoc.validate(o)) {
            throw new AjvValidator.ValidationError(Typedoc.validate.errors ?? [])
        }
    },
}

/**
 * Specify the npm plugins that should be loaded. Omit to load all installed plugins.
 */
type PluginLocal = string[]

/**
 * Path to the readme file that should be displayed on the index page. Pass none to disable the index page and start the documentation on the globals page.
 */
type ReadmeLocal = 'none' | string

/**
 * The sources files from which to build documentation.
 * DEPRECATED: Use inputFiles instead.
 */
type SrcLocal = string | string[]

/**
 * Specify the path to the theme that should be used.
 */
type ThemeLocal = 'default' | 'minimal' | string
