import { execute } from './cli'

import yargs from 'yargs'
export * from './types'

import path from 'path'

export function therefore<T>(v: unknown, schema: { assert: (o: unknown) => asserts o is T }): asserts v is T {
    schema.assert(v)
}

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { bin } = require('../package.json')

export async function run(): Promise<void> {
    const argv = yargs
        .scriptName(Object.keys(bin)[0] as string)
        .option('file', {
            alias: 'f',
            //demandOption: true,
            //default: ['src/**/*.ts'],
            describe: 'globs to scan for schemas',
            type: 'array',
        })
        .option('dir', {
            alias: 'd',
            describe: 'directories',
            type: 'array',
            coerce: (ds: readonly string[]) => ds.map((d) => path.join('.', d, `**/*.schema.ts`).replace(/\\/g, '/')),
        })
        .option('exclude', {
            alias: 'e',
            demandOption: true,
            default: ['**/*.d.ts', 'node_modules/**'],
            describe: 'globs to exclude',
            type: 'array',
        })
        .option('fmt', {
            default: true,
            type: 'boolean',
        })
        .option('ext', {
            default: '.type.ts',
            type: 'string',
        })
        .strict()
        .help().argv

    argv.file ??= []
    argv.dir ??= []

    const files: string[] = Array.isArray(argv.file) ? (argv.file as string[]) : [argv.file]
    const dirs: string[] = Array.isArray(argv.dir) ? (argv.dir as string[]) : [argv.dir]
    await execute({
        globs: [...files, ...dirs],
        excludes: Array.isArray(argv.exclude) ? argv.exclude : [argv.exclude],
        format: argv.fmt,
        extension: argv.ext,
    })
}
