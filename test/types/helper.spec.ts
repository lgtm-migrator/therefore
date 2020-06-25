import { $nullable, $optional, $string } from '~/index'

describe('optional', () => {
    test('string', () => {
        expect($optional($string)).toMatchInlineSnapshot(`
            Object {
              Symbol(type): "string",
              Symbol(optional): true,
            }
        `)
        expect($optional($string())).toMatchInlineSnapshot(`
            Object {
              Symbol(type): "string",
              Symbol(optional): true,
            }
        `)
    })
})

describe('$nullable', () => {
    test('string', () => {
        expect($nullable($string)).toMatchInlineSnapshot(`
            Object {
              Symbol(type): "string",
              Symbol(nullable): true,
            }
        `)
        expect($nullable($string())).toMatchInlineSnapshot(`
            Object {
              Symbol(type): "string",
              Symbol(nullable): true,
            }
        `)
    })
})
