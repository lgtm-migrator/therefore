jest.mock('uuid')

import { mockUuid } from '../util'

import { $object, $string, $array, $dict, $tuple, $ref, $union, $intersection, $boolean } from '~/index'
import { schema } from '~/therefore'

import { v4 as uuid } from 'uuid'

describe('object', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($object).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($object({ foo: $string })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "foo": Object {
                  "type": "string",
                  "uuid": "0001-000",
                },
              },
              "type": "object",
              "uuid": "0002-000",
            }
        `)
        expect($object({ foo: $object() })).toMatchInlineSnapshot(`
            Object {
              "properties": Object {
                "foo": Object {
                  "properties": Object {},
                  "type": "object",
                  "uuid": "0003-000",
                },
              },
              "type": "object",
              "uuid": "0004-000",
            }
        `)
    })

    test('example', () => {
        expect($object({}, { [schema.examples]: [{ foo: 'bar' }] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
                Object {
                  "foo": "bar",
                },
              ],
              "properties": Object {},
              "type": "object",
              "uuid": "0001-000",
            }
        `)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        $object({}, { [schema.examples]: ['foo'] })
    })

    test('default', () => {
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
        expect(
            $object({
                [$object.description]:
                    'Declares which extensions, apps, and web pages can connect to your extension via runtime.connect and runtime.sendMessage.',
                ids: $array($string, {
                    description:
                        'The IDs of extensions or apps that are allowed to connect. If left empty or unspecified, no extensions or apps can connect.',
                    minItems: 1,
                    //uniqueItems: true,
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
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($array).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($array($string)).toMatchInlineSnapshot(`
            Object {
              "items": Object {
                "type": "string",
                "uuid": "0001-000",
              },
              "type": "array",
              "uuid": "0002-000",
            }
        `)
    })

    test('example', () => {
        expect($array($string, { [schema.examples]: [['bar']] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
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
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($dict).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
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
        expect($dict($string, { [schema.examples]: [{ foo: 'bar' }] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
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
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($tuple).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
        expect($tuple([$string])).toMatchInlineSnapshot(`
            Object {
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
    })

    test('example', () => {
        expect($tuple([$string], { [schema.examples]: [['bar']] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
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
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

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
                },
                "type": "dict",
                "uuid": undefined,
              },
              "type": "$ref",
              "uuid": "0001-000",
            }
        `)
    })
})

describe('union', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($union).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
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
        expect($union([$string], { [schema.examples]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
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
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('function', () => {
        expect($intersection).toMatchInlineSnapshot(`[Function]`)
    })

    test('expand', () => {
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
        expect($intersection([$string], { [schema.examples]: ['bar'] })).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
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
