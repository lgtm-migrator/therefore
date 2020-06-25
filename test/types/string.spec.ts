import { $string } from '~/index'

describe('string', () => {
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
              Symbol(type): "string",
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
              Symbol(type): "string",
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
              Symbol(type): "string",
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
              Symbol(type): "string",
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
              Symbol(type): "string",
            }
        `)
    })
})
