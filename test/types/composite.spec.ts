jest.mock('uuid')

import { $object, $string, $array, $dict, $tuple, $ref, $union, $intersection, $boolean } from '~/index'
import { schema } from '~/therefore'

import { v4 as uuid } from 'uuid'

describe('object', () => {
    test('function', () => {
        expect($object).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        const mocked = uuid as jest.Mock
        mocked
            .mockReturnValueOnce('0001-000')
            .mockReturnValueOnce('0002-000')
            .mockReturnValueOnce('0003-000')
            .mockReturnValueOnce('0004-000')

        expect($object({ foo: $string })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "foo": Object {
                  "type": "string",
                  "uuid": "0003-000",
                },
              },
              "type": "object",
              "uuid": "0001-000",
            }
        `)
        expect($object({ foo: $object() })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "foo": Object {
                  "properties": Object {},
                  "type": "object",
                  "uuid": "0002-000",
                },
              },
              "type": "object",
              "uuid": "0003-000",
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($object({}, { [schema.examples]: [{ foo: 'bar' }] })).toMatchInlineSnapshot(`
            Object {
              "example": Array [
                Object {
                  "foo": "bar",
                },
              ],
              "properties": Object {},
              "type": "object",
              "uuid": "0004-000",
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
              "default": Object {
                "foo": "bar",
              },
              "properties": Object {},
              "type": "object",
              "uuid": "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $object({}, { [schema.default]: 'foobar' })
    })

    test.skip('complex', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        const $description = 'description'
        expect(
            $object({
                [$description]:
                    'Declares which extensions, apps, and web pages can connect to your extension via runtime.connect and runtime.sendMessage.',
                ids: $array($string, {
                    description:
                        'The IDs of extensions or apps that are allowed to connect. If left empty or unspecified, no extensions or apps can connect.',
                    minItems: 1,
                    uniqueItems: true,
                }),
                matches: $string({
                    description:
                        'The URL patterns for web pages that are allowed to connect. This does not affect content scripts. If left empty or unspecified, no web pages can connect.',
                }),
                booleans: $boolean({
                    default: false,
                    description:
                        "Indicates that the extension would like to make use of the TLS channel ID of the web page connecting to it. The web page must also opt to send the TLS channel ID to the extension via setting includeTlsChannelId to true in runtime.connect's connectInfo or runtime.sendMessage's options.",
                }),
            })
        ).toMatchInlineSnapshot(`
            Object {
              "default": Object {
                "foo": "bar",
              },
              "properties": Object {},
              "type": "object",
              "uuid": "0001-000",
            }
        `)
    })
})

describe('array', () => {
    test('function', () => {
        expect($array).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($array($string)).toMatchInlineSnapshot(`
            Object {
              "items": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "array",
              "uuid": undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($array($string, { [schema.examples]: [['bar']] })).toMatchInlineSnapshot(`
            Object {
              "example": Array [
                Array [
                  "bar",
                ],
              ],
              "items": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "array",
              "uuid": "0002-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $array({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($array($string, { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "default": Array [
                "bar",
              ],
              "items": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "array",
              "uuid": "0002-000",
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
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($dict($string)).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "dict",
              "uuid": "0002-000",
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($dict($string, { [schema.examples]: [{ foo: 'bar' }] })).toMatchInlineSnapshot(`
            Object {
              "example": Array [
                Object {
                  "foo": "bar",
                },
              ],
              "properties": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "dict",
              "uuid": "0002-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $dict({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($dict($string, { [schema.default]: { foo: 'bar' } })).toMatchInlineSnapshot(`
            Object {
              "default": Object {
                "foo": "bar",
              },
              "properties": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "dict",
              "uuid": "0002-000",
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
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000')

        expect($tuple([$string])).toMatchInlineSnapshot(`
            Object {
              "items": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "type": "tuple",
              "uuid": undefined,
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($tuple([$string], { [schema.examples]: [['bar']] })).toMatchInlineSnapshot(`
            Object {
              "example": Array [
                Array [
                  "bar",
                ],
              ],
              "items": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "type": "tuple",
              "uuid": "0002-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $tuple({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($tuple([$string], { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "default": Array [
                "bar",
              ],
              "items": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "type": "tuple",
              "uuid": "0002-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $tuple({}, { [schema.default]: 'foobar' })
    })
})

describe('ref', () => {
    const mocked = uuid as jest.Mock
    mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000').mockReturnValueOnce('0003-000')

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
                  "type": "string",
                  "uuid": "0001-000",
                },
                "type": "dict",
                "uuid": "0002-000",
              },
              "type": "$ref",
            }
        `)
    })
})

describe('union', () => {
    test('function', () => {
        expect($union).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($union([$string])).toMatchInlineSnapshot(`
            Object {
              "type": "union",
              "union": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "uuid": "0002-000",
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($union([$string], { [schema.examples]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "example": Array [
                "bar",
              ],
              "type": "union",
              "union": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "uuid": "0002-000",
            }
        `)
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($union([$string], { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "default": Array [
                "bar",
              ],
              "type": "union",
              "union": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "uuid": "0002-000",
            }
        `)
    })
})

describe('intersection', () => {
    test('function', () => {
        expect($intersection).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($intersection([$string])).toMatchInlineSnapshot(`
            Object {
              "intersection": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "type": "intersection",
              "uuid": "0002-000",
            }
        `)
    })

    test('example', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($intersection([$string], { [schema.examples]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "example": Array [
                "bar",
              ],
              "intersection": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "type": "intersection",
              "uuid": "0002-000",
            }
        `)
    })

    test('default', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        expect($intersection([$string], { [schema.default]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "default": Array [
                "bar",
              ],
              "intersection": Array [
                Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              ],
              "type": "intersection",
              "uuid": "0002-000",
            }
        `)
    })
})
