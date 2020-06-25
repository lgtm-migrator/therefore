import { $integer } from '~/index'

describe('integer', () => {
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
              Symbol(type): "integer",
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
              Symbol(type): "integer",
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
              Symbol(type): "integer",
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
              Symbol(type): "integer",
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
              Symbol(type): "integer",
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
              Symbol(type): "integer",
            }
        `)
    })
})
