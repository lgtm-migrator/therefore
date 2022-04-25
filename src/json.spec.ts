import { compileSchemas } from './commands/generate/generate'

test('json', async () => {
    expect(
        await compileSchemas(['examples/json/json.schema.ts'], {
            outputFileRename: (file: string) => file.replace('.ts', '.type.ts'),
            cwd: process.cwd(),
            compile: false,
        })
    ).toMatchSnapshot()
})

test('simple', async () => {
    expect(
        await compileSchemas(['examples/json/simple.schema.ts'], {
            outputFileRename: (file: string) => file.replace('.ts', '.type.ts'),
            cwd: process.cwd(),
            compile: false,
        })
    ).toMatchSnapshot()
})
