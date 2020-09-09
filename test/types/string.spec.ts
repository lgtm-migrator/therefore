jest.mock('uuid')

import { mockUuid } from '../util'

import { $string } from '~/index'

import { v4 as uuid } from 'uuid'

describe('string', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($string).toMatchInlineSnapshot(`[Function]`)
    })

    test('minLength', () => {
        expect(
            $string({
                minLength: 2,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "minLength": 2,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })

    test('maxLength', () => {
        expect(
            $string({
                maxLength: 2,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "maxLength": 2,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })

    test('pattern', () => {
        expect(
            $string({
                pattern: /foo/,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "pattern": /foo/,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })

    test('format', () => {
        expect(
            $string({
                format: 'date',
            })
        ).toMatchInlineSnapshot(`
            Object {
              "format": "date",
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })

    test('all', () => {
        expect(
            $string({
                minLength: 2,
                maxLength: 2,
                pattern: /foo/,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "maxLength": 2,
              "minLength": 2,
              "pattern": /foo/,
              "type": "string",
              "uuid": "0001-000",
            }
        `)
    })
})
