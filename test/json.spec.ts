jest.mock('uuid')

import { mockUuid } from './util'

import { compileSchemas } from '~/cli'

import { v4 as uuid } from 'uuid'

describe('schema', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))
    test('json', async () => {
        expect(await compileSchemas(['examples/json/json.ts'], '.schema.ts', process.cwd())).toMatchSnapshot()
    })
    test('simple', async () => {
        expect(await compileSchemas(['examples/json/simple.ts'], '.schema.ts', process.cwd())).toMatchSnapshot()
    })
})
