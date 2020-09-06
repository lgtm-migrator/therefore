jest.mock('uuid')

import { $number } from '~/index'

import { v4 as uuid } from 'uuid'

describe('number', () => {
    const mocked = uuid as jest.Mock

    beforeEach(() => mocked.mockReturnValueOnce('0001-000'))

    test('function', () => {
        expect($number).toMatchInlineSnapshot(`[Function]`)
    })

    test('multipleOf', () => {
        expect(
            $number({
                multipleOf: 0.01,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "multipleOf": 0.01,
              "type": "number",
              "uuid": "0001-000",
            }
        `)
    })

    test('maximum', () => {
        expect(
            $number({
                maximum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "maximum": 100,
              "type": "number",
              "uuid": "0001-000",
            }
        `)
    })

    test('exclusiveMaximum', () => {
        expect(
            $number({
                exclusiveMaximum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "exclusiveMaximum": 100,
              "type": "number",
              "uuid": "0001-000",
            }
        `)
    })

    test('minimum', () => {
        expect(
            $number({
                minimum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "minimum": 100,
              "type": "number",
              "uuid": "0001-000",
            }
        `)
    })

    test('exclusiveMinimum', () => {
        expect(
            $number({
                exclusiveMinimum: 100,
            })
        ).toMatchInlineSnapshot(`
            Object {
              "exclusiveMinimum": 100,
              "type": "number",
              "uuid": "0001-000",
            }
        `)
    })

    test('combined', () => {
        expect(
            $number({
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
              "type": "number",
              "uuid": "0001-000",
            }
        `)
    })
})
