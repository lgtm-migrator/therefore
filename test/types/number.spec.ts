import { $number } from '~/index'

describe('number', () => {
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
              Symbol(type): "number",
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
              Symbol(type): "number",
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
              Symbol(type): "number",
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
              Symbol(type): "number",
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
              Symbol(type): "number",
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
              Symbol(type): "number",
            }
        `)
    })
})
