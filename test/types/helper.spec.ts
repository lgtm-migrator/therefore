jest.mock('uuid')

import { mockUuid } from '../util'

import { $nullable, $optional, $string } from '~/index'

import { v4 as uuid } from 'uuid'

describe('optional', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('string', () => {
        expect($optional($string)).toMatchInlineSnapshot(`
            Object {
              "optional": true,
              "type": "string",
              "uuid": "0002-000",
            }
        `)
        expect($optional($string())).toMatchInlineSnapshot(`
            Object {
              "optional": true,
              "type": "string",
              "uuid": "0004-000",
            }
        `)
    })
})

describe('$nullable', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('string', () => {
        expect($nullable($string)).toMatchInlineSnapshot(`
            Object {
              "nullable": true,
              "type": "string",
              "uuid": "0002-000",
            }
        `)
        expect($nullable($string())).toMatchInlineSnapshot(`
            Object {
              "nullable": true,
              "type": "string",
              "uuid": "0004-000",
            }
        `)
    })
})
