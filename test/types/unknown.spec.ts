jest.mock('uuid')

import { $unknown } from '~/index'

import { v4 as uuid } from 'uuid'

describe('unknown', () => {
    const mocked = uuid as jest.Mock

    beforeEach(() => mocked.mockReturnValueOnce('0001-000'))

    test('function', () => {
        expect($unknown).toMatchInlineSnapshot(`[Function]`)
    })

    test('simple', () => {
        expect($unknown()).toMatchInlineSnapshot(`
            Object {
              "type": "unknown",
              "uuid": "0001-000",
            }
        `)
    })
})
