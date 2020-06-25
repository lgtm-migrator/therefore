import { $boolean } from '~/index'
import { schema } from '~/therefore'

describe('boolean', () => {
    test('function', () => {
        expect($boolean).toMatchInlineSnapshot(`[Function]`)
    })

    test('example', () => {
        expect($boolean({ [schema.examples]: [true, false] })).toMatchInlineSnapshot(`
            Object {
              Symbol(type): "boolean",
              Symbol(example): Array [
                true,
                false,
              ],
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $boolean({ [schema.examples]: ['foo'] })
    })

    test('default', () => {
        expect($boolean({ [schema.default]: true })).toMatchInlineSnapshot(`
            Object {
              Symbol(type): "boolean",
              Symbol(default): true,
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $boolean({ [schema.default]: 'foobar' })
    })
})
