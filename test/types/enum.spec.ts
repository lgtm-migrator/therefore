jest.mock('uuid')

import { $enum } from '~/index'

import { v4 as uuid } from 'uuid'

describe('enum', () => {
    test('function', () => {
        expect($enum).toMatchInlineSnapshot(`[Function]`)
    })

    test('values', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($enum([1, 2, 3, '4'])).toMatchInlineSnapshot(`
            Object {
              "values": Array [
                1,
                2,
                3,
                "4",
              ],
              Symbol(type): "enum",
              Symbol(uuid): "0001-000",
            }
        `)
    })

    test('named', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

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
              "values": Array [
                "bar",
                "baz",
              ],
              Symbol(type): "enum",
              Symbol(uuid): "0001-000",
            }
        `)
    })
})
