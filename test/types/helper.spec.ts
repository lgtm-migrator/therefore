jest.mock('uuid')

import { $nullable, $optional, $string } from '~/index'

import { v4 as uuid } from 'uuid'

describe('optional', () => {
    const mocked = uuid as jest.Mock

    beforeEach(() => mocked.mockReturnValue('0001-000'))

    test('string', () => {
        expect($optional($string)).toMatchInlineSnapshot(`
            Object {
              "optional": true,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
        expect($optional($string())).toMatchInlineSnapshot(`
            Object {
              "optional": true,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })
})

describe('$nullable', () => {
    const mocked = uuid as jest.Mock

    beforeEach(() => mocked.mockReturnValue('0001-000'))

    test('string', () => {
        expect($nullable($string)).toMatchInlineSnapshot(`
            Object {
              "nullable": true,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
        expect($nullable($string())).toMatchInlineSnapshot(`
            Object {
              "nullable": true,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })
})
