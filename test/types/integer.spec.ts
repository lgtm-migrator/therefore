jest.mock('uuid')

import { $integer } from '~/index'

import { v4 as uuid } from 'uuid'

describe('integer', () => {
    const mocked = uuid as jest.Mock

    beforeEach(() => mocked.mockReturnValueOnce('0001-000'))

    test('function', () => {
        expect($integer).toMatchInlineSnapshot(`[Function]`)
    })

    test('multipleOf', () => {
        expect(
            $integer({
                multipleOf: 0.01,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "multipleOf": 0.01,
              "type": "integer",
              "uuid": "0001-000",
            }
        `)
    })

    test('maximum', () => {
        expect(
            $integer({
                maximum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "maximum": 100,
              "type": "integer",
              "uuid": "0001-000",
            }
        `)
    })

    test('exclusiveMaximum', () => {
        expect(
            $integer({
                exclusiveMaximum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "exclusiveMaximum": 100,
              "type": "integer",
              "uuid": "0001-000",
            }
        `)
    })

    test('minimum', () => {
        expect(
            $integer({
                minimum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "minimum": 100,
              "type": "integer",
              "uuid": "0001-000",
            }
        `)
    })

    test('exclusiveMinimum', () => {
        expect(
            $integer({
                exclusiveMinimum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "exclusiveMinimum": 100,
              "type": "integer",
              "uuid": "0001-000",
            }
        `)
    })

    test('combined', () => {
        expect(
            $integer({
                multipleOf: 0.01,
                maximum: 100,
                exclusiveMaximum: 100,
                minimum: 100,
                exclusiveMinimum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "exclusiveMaximum": 100,
              "exclusiveMinimum": 100,
              "maximum": 100,
              "minimum": 100,
              "multipleOf": 0.01,
              "type": "integer",
              "uuid": "0001-000",
            }
        `)
    })
})
