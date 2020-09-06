jest.mock('uuid')

import { $null } from '~/index'

import { v4 as uuid } from 'uuid'

describe('null', () => {
    const mocked = uuid as jest.Mock

    beforeEach(() => mocked.mockReturnValueOnce('0001-000'))

    test('function', () => {
        expect($null).toMatchInlineSnapshot(`[Function]`)
    })

    test('simple', () => {
        expect($null()).toMatchInlineSnapshot(`
            Object {
              "type": "null",
              "uuid": "0001-000",
            }
        `)
    })
})
