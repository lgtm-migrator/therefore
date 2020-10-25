jest.mock('uuid')

import { mockUuid } from './util'

import { compileSchemas } from '~/cli'

import { v4 as uuid } from 'uuid'

describe('schema', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))
    test('typedoc', async () => {
        expect(await compileSchemas(['examples/typedoc/typedoc.schema.ts'], '.type.ts', process.cwd())).toMatchSnapshot()
    })
})
