jest.mock('uuid')

import { $object, $string, $array, $dict, $tuple, $ref, $union, $intersection } from '~/index'
import { schema } from '~/therefore'

import { v4 as uuid } from 'uuid'

describe('object', () => {
    test('function', () => {
        expect($object).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($object({ foo: $string })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "foo": Object {
                  Symbol(type): "string",
                },
              },
              Symbol(type): "object",
              Symbol(uuid): undefined,
            }
        `)
        expect($object({ foo: $object() })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "foo": Object {
                  "properties": Object {},
                  Symbol(type): "object",
                  Symbol(uuid): undefined,
                },
              },
              Symbol(type): "object",
              Symbol(uuid): undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($object({}, { [schema.examples]: [{ foo: 'bar' }] })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {},
              Symbol(type): "object",
              Symbol(example): Array [
                Object {
                  "foo": "bar",
                },
              ],
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $object({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($object({}, { [schema.default]: { foo: 'bar' } })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {},
              Symbol(type): "object",
              Symbol(default): Object {
                "foo": "bar",
              },
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $object({}, { [schema.default]: 'foobar' })
    })
})

describe('array', () => {
    test('function', () => {
        expect($array).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($array($string)).toMatchInlineSnapshot(`
            Object {
              "items": Object {
                Symbol(type): "string",
              },
              Symbol(type): "array",
              Symbol(uuid): undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($array($string, { [schema.examples]: [['bar']] })).toMatchInlineSnapshot(`
            Object {
              "items": Object {
                Symbol(type): "string",
              },
              Symbol(type): "array",
              Symbol(example): Array [
                Array [
                  "bar",
                ],
              ],
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $array({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($array($string, { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "items": Object {
                Symbol(type): "string",
              },
              Symbol(type): "array",
              Symbol(default): Array [
                "bar",
              ],
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $array({}, { [schema.default]: 'foobar' })
    })
})

describe('dict', () => {
    test('function', () => {
        expect($dict).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($dict($string)).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                Symbol(type): "string",
              },
              Symbol(type): "dict",
              Symbol(uuid): undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($dict($string, { [schema.examples]: [{ foo: 'bar' }] })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                Symbol(type): "string",
              },
              Symbol(type): "dict",
              Symbol(example): Array [
                Object {
                  "foo": "bar",
                },
              ],
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $dict({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($dict($string, { [schema.default]: { foo: 'bar' } })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                Symbol(type): "string",
              },
              Symbol(type): "dict",
              Symbol(default): Object {
                "foo": "bar",
              },
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $dict({}, { [schema.default]: 'foobar' })
    })
})

describe('tuple', () => {
    test('function', () => {
        expect($tuple).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($tuple([$string])).toMatchInlineSnapshot(`
            Object {
              "items": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "tuple",
              Symbol(uuid): undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($tuple([$string], { [schema.examples]: [['bar']] })).toMatchInlineSnapshot(`
            Object {
              "items": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "tuple",
              Symbol(example): Array [
                Array [
                  "bar",
                ],
              ],
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $tuple({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($tuple([$string], { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "items": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "tuple",
              Symbol(default): Array [
                "bar",
              ],
              Symbol(uuid): "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $tuple({}, { [schema.default]: 'foobar' })
    })
})

describe('ref', () => {
    const foo = $dict($string)
    test('function', () => {
        expect($ref).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($ref({ foo })).toMatchInlineSnapshot(`
            Object {
              "name": "foo",
              "reference": Object {
                "properties": Object {
                  Symbol(type): "string",
                },
                Symbol(type): "dict",
                Symbol(uuid): undefined,
              },
              Symbol(type): "$ref",
            }
        `)
    })
})

describe('union', () => {
    test('function', () => {
        expect($union).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($union([$string])).toMatchInlineSnapshot(`
            Object {
              "union": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "union",
              Symbol(uuid): undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($union([$string], { [schema.examples]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "union": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "union",
              Symbol(example): Array [
                "bar",
              ],
              Symbol(uuid): "0001-000",
            }
        `)
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($union([$string], { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "union": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "union",
              Symbol(default): Array [
                "bar",
              ],
              Symbol(uuid): "0001-000",
            }
        `)
    })
})

describe('intersection', () => {
    test('function', () => {
        expect($intersection).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($intersection([$string])).toMatchInlineSnapshot(`
            Object {
              "intersection": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "intersection",
              Symbol(uuid): undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($intersection([$string], { [schema.examples]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "intersection": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "intersection",
              Symbol(example): Array [
                "bar",
              ],
              Symbol(uuid): "0001-000",
            }
        `)
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($intersection([$string], { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "intersection": Array [
                Object {
                  Symbol(type): "string",
                },
              ],
              Symbol(type): "intersection",
              Symbol(default): Array [
                "bar",
              ],
              Symbol(uuid): "0001-000",
            }
        `)
    })
})
