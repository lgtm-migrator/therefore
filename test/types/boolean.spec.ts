jest.mock('uuid')

import { mockUuid } from '../util'

import { $boolean } from '~/index'
import { schema } from '~/therefore'

import { v4 as uuid } from 'uuid'

describe('boolean', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($boolean).toMatchInlineSnapshot(`[Function]`)
    })

    test('example', () => {
        expect($boolean({ [schema.examples]: [true, false] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
                true,
                false,
              ],
              "type": "boolean",
              "uuid": "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $boolean({ [schema.examples]: ['foo'] })
    })

    test('default', () => {
        expect($boolean({ [schema.default]: true })).toMatchInlineSnapshot(`
            Object {
              "default": true,
              "type": "boolean",
              "uuid": "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $boolean({ [schema.default]: 'foobar' })
    })
})
