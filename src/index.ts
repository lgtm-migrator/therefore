import { execute } from './cli'

import yargs from 'yargs'
export * from './types'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { bin } = require('../package.json')

// eslint-disable-next-line @typescript-eslint/require-await
export async function run(): Promise<void> {
    const argv = yargs
        .scriptName(Object.keys(bin)[0])
        .option('file', {
            alias: 'f',
            demandOption: true,
            default: ['src/**/*.ts'],
            describe: 'globs to scan for schemas',
            type: 'array',
        })
        .option('dir', {
            alias: 'd',
            describe: 'directories',
            type: 'array',
            coerce: (ds: string[]) => ds.map((d) => `${d}/**/*.ts`),
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
            default: '.schema.ts',
            type: 'string',
        })
        .strict()
        .help().argv

    const globs = Array.isArray(argv.file) ? argv.file : [argv.file]
    await execute({
        globs,
        excludes: Array.isArray(argv.exclude) ? argv.exclude : [argv.exclude],
        format: argv.fmt,
        extension: argv.ext,
    })
}
