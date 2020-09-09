jest.mock('uuid')

import { mockUuid } from '../util'

import { $enum } from '~/index'

import { v4 as uuid } from 'uuid'

describe('enum', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($enum).toMatchInlineSnapshot(`[Function]`)
    })

    test('values', () => {
        expect($enum([1, 2, 3, '4'])).toMatchInlineSnapshot(`
            Object {
              "type": "enum",
              "uuid": "0001-000",
              "values": Array [
                1,
                2,
                3,
                "4",
              ],
            }
        `)
    })

    test('named', () => {
        expect(
            $enum({
                foo: 'bar',
                woo: 'baz',
            })
        ).toMatchInlineSnapshot(`
            Object {
              "names": Array [
                "foo",
                "woo",
              ],
              "type": "enum",
              "uuid": "0001-000",
              "values": Array [
                "bar",
                "baz",
              ],
            }
        `)
    })
})
