jest.mock('uuid')

import {
    $array,
    $boolean,
    $dict,
    $enum,
    $integer,
    $intersection,
    $null,
    $nullable,
    $number,
    $object,
    $optional,
    $ref,
    $string,
    $tuple,
    $union,
    $unknown,
} from '~/index'
import { annotate, jsonSchemaVisitor, toJsonSchema, toType } from '~/schema'
import { schema } from '~/therefore'
import { walkGraph } from '~/ast'

import { v4 as uuid } from 'uuid'

describe('toType', () => {
    test('nullable', () => {
        expect(toType('string', { [schema.nullable]: true, [schema.type]: 'string' })).toEqual(['string', 'null'])
    })

    test('first argument (json schema type) is leading', () => {
        expect(toType('string', { [schema.nullable]: true, [schema.type]: 'integer' })).toEqual(['string', 'null'])
    })

    test('not nullable', () => {
        expect(toType('string', { [schema.nullable]: false, [schema.type]: 'string' })).toEqual('string')
    })

    test('default', () => {
        expect(toType('string', { [schema.type]: 'string' })).toEqual('string')
    })
})

describe('annotate', () => {
    test('title', () => {
        expect(annotate($string({ [schema.title]: 'foo title' }))).toMatchInlineSnapshot(`
            Object {
              "title": "foo title",
            }
        `)
    })

    test('description', () => {
        expect(annotate($string({ [schema.description]: 'foo description' }))).toMatchInlineSnapshot(`
            Object {
              "description": "foo description",
            }
        `)
    })

    test('default', () => {
        expect(annotate($string({ [schema.default]: 'default string' }))).toMatchInlineSnapshot(`
            Object {
              "default": "default string",
            }
        `)
        expect(annotate($object({ foo: $string }, { [schema.default]: { foo: 'default string' } }))).toMatchInlineSnapshot(`
            Object {
              "default": Object {
                "foo": "default string",
              },
            }
        `)
    })

    test('readonly', () => {
        expect(annotate($string({ [schema.readonly]: true }))).toMatchInlineSnapshot(`
            Object {
              "readonly": true,
            }
        `)
        expect(annotate($string({ [schema.readonly]: false }))).toMatchInlineSnapshot(`
            Object {
              "readonly": false,
            }
        `)
    })

    test('examples', () => {
        expect(annotate($string({ [schema.examples]: ['foo', 'bar'] }))).toMatchInlineSnapshot(`
            Object {
              "examples": Array [
                "foo",
                "bar",
              ],
            }
        `)
    })
})

describe('toTypeDefinition', () => {
    test('string', () => {
        expect(walkGraph($string(), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "type": "string",
            }
        `)
    })

    test('number', () => {
        expect(walkGraph($number(), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "type": "number",
            }
        `)
    })

    test('integer', () => {
        expect(walkGraph($integer(), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "type": "integer",
            }
        `)
    })

    test('boolean', () => {
        expect(walkGraph($boolean(), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "type": "boolean",
            }
        `)
    })

    test('null', () => {
        expect(walkGraph($null(), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "type": "null",
            }
        `)
    })

    test('unknown', () => {
        expect(walkGraph($unknown(), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`Object {}`)
    })

    test('enum', () => {
        expect(walkGraph($enum(['foo', 'bar', { foo: 'bar' }]), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "enum": Array [
                "foo",
                "bar",
                Object {
                  "foo": "bar",
                },
              ],
            }
        `)
        expect(walkGraph($enum({ foo: 'bar', bar: 1, baz: true }), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "enum": Array [
                "bar",
                1,
                true,
              ],
            }
        `)
        expect(walkGraph($enum({ foo: 'bar', bar: [1, 2, 3] }), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "enum": Array [
                "bar",
                Array [
                  1,
                  2,
                  3,
                ],
              ],
            }
        `)
        expect(walkGraph($enum(['foobar']), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "const": "foobar",
            }
        `)
    })

    test('array', () => {
        expect(walkGraph($array($string), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "items": Object {
                "type": "string",
              },
              "type": "array",
            }
        `)
        expect(walkGraph($array($enum(['foo', 'bar', { foo: 'bar' }])), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "items": Object {
                "enum": Array [
                  "foo",
                  "bar",
                  Object {
                    "foo": "bar",
                  },
                ],
              },
              "type": "array",
            }
        `)
        expect(walkGraph($array($union([$string, $integer])), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "items": Object {
                "oneOf": Array [
                  Object {
                    "type": "string",
                  },
                  Object {
                    "type": "integer",
                  },
                ],
              },
              "type": "array",
            }
        `)
    })

    test('tuple', () => {
        expect(walkGraph($tuple([$string, $string, $integer]), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "additionalItems": false,
              "items": Array [
                Object {
                  "type": "string",
                },
                Object {
                  "type": "string",
                },
                Object {
                  "type": "integer",
                },
              ],
              "type": "array",
            }
        `)
    })

    test('named tuple', () => {
        expect(
            walkGraph(
                $tuple({
                    foo: $string,
                    boo: $integer,
                }),
                jsonSchemaVisitor,
                { references: {}, definitions: {} }
            )
        ).toMatchInlineSnapshot(`
            Object {
              "additionalItems": false,
              "items": Array [
                Object {
                  "type": "string",
                },
                Object {
                  "type": "integer",
                },
              ],
              "type": "array",
            }
        `)
        expect(
            walkGraph(
                $tuple({
                    x: $number,
                    y: $number,
                    z: $number,
                }),
                jsonSchemaVisitor,
                { references: {}, definitions: {} }
            )
        ).toMatchInlineSnapshot(`
            Object {
              "additionalItems": false,
              "items": Array [
                Object {
                  "type": "number",
                },
                Object {
                  "type": "number",
                },
                Object {
                  "type": "number",
                },
              ],
              "type": "array",
            }
        `)
    })

    test('dict', () => {
        expect(walkGraph($dict($string), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "additionalProperties": Object {
                "type": "string",
              },
              "type": "object",
            }
        `)
    })

    test('ref', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        const foo = $dict($string)
        expect(walkGraph($ref({ foo }), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "$ref": "#/definitions/{{0002-000}}",
            }
        `)
        // test the stable uuid referencing
        expect(walkGraph($union([$ref({ foo }), $dict($ref({ foo }))]), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "oneOf": Array [
                Object {
                  "$ref": "#/definitions/{{0002-000}}",
                },
                Object {
                  "additionalProperties": Object {
                    "$ref": "#/definitions/{{0002-000}}",
                  },
                  "type": "object",
                },
              ],
            }
        `)
        expect(
            walkGraph($union([$ref({ foo }), $dict($nullable($ref({ foo })))]), jsonSchemaVisitor, {
                references: {},
                definitions: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "oneOf": Array [
                Object {
                  "$ref": "#/definitions/{{0002-000}}",
                },
                Object {
                  "additionalProperties": Object {
                    "oneOf": Array [
                      Object {
                        "type": "null",
                      },
                      Object {
                        "$ref": "#/definitions/{{0002-000}}",
                      },
                    ],
                  },
                  "type": "object",
                },
              ],
            }
        `)
    })

    test('union', () => {
        expect(walkGraph($union([$string]), jsonSchemaVisitor, { references: {}, definitions: {} })).toMatchInlineSnapshot(`
            Object {
              "oneOf": Array [
                Object {
                  "type": "string",
                },
              ],
            }
        `)
        expect(walkGraph($union([$string, $string, $integer]), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "oneOf": Array [
                Object {
                  "type": "string",
                },
                Object {
                  "type": "string",
                },
                Object {
                  "type": "integer",
                },
              ],
            }
        `)
    })

    test('intersection', () => {
        expect(walkGraph($intersection([$string]), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "allOf": Array [
                Object {
                  "type": "string",
                },
              ],
            }
        `)
        expect(walkGraph($intersection([$string, $integer]), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "allOf": Array [
                Object {
                  "type": "string",
                },
                Object {
                  "type": "integer",
                },
              ],
            }
        `)
    })

    test('union & intersection', () => {
        expect(
            walkGraph($union([$string, $intersection([$string, $integer]), $integer]), jsonSchemaVisitor, {
                references: {},
                definitions: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "oneOf": Array [
                Object {
                  "type": "string",
                },
                Object {
                  "allOf": Array [
                    Object {
                      "type": "string",
                    },
                    Object {
                      "type": "integer",
                    },
                  ],
                },
                Object {
                  "type": "integer",
                },
              ],
            }
        `)
    })

    test('object', () => {
        expect(walkGraph($object({ foo: $string }), jsonSchemaVisitor, { references: {}, definitions: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "additionalProperties": false,
              "properties": Object {
                "foo": Object {
                  "type": "string",
                },
              },
              "required": Array [
                "foo",
              ],
              "type": "object",
            }
        `)
        expect(
            walkGraph($object({ foo: $string, bar: $nullable($integer), baz: $optional($integer) }), jsonSchemaVisitor, {
                references: {},
                definitions: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "additionalProperties": false,
              "properties": Object {
                "bar": Object {
                  "type": Array [
                    "integer",
                    "null",
                  ],
                },
                "baz": Object {
                  "type": "integer",
                },
                "foo": Object {
                  "type": "string",
                },
              },
              "required": Array [
                "foo",
                "bar",
              ],
              "type": "object",
            }
        `)
        expect(
            walkGraph($object({ foo: $string, bar: $string({ [schema.description]: 'fooscription' }) }), jsonSchemaVisitor, {
                references: {},
                definitions: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "additionalProperties": false,
              "properties": Object {
                "bar": Object {
                  "description": "fooscription",
                  "type": "string",
                },
                "foo": Object {
                  "type": "string",
                },
              },
              "required": Array [
                "foo",
                "bar",
              ],
              "type": "object",
            }
        `)
        expect(
            walkGraph(
                $object(
                    {
                        foo: $string,
                        bar: $string({ [schema.description]: 'fooscription' }),
                    },
                    { [schema.default]: { foo: 'bar', bar: 'foo' } }
                ),
                jsonSchemaVisitor,
                {
                    references: {},
                    definitions: {},
                }
            )
        ).toMatchInlineSnapshot(`
            Object {
              "additionalProperties": false,
              "default": Object {
                "bar": "foo",
                "foo": "bar",
              },
              "properties": Object {
                "bar": Object {
                  "description": "fooscription",
                  "type": "string",
                },
                "foo": Object {
                  "type": "string",
                },
              },
              "required": Array [
                "foo",
                "bar",
              ],
              "type": "object",
            }
        `)
    })
})

describe('toJsonSchema', () => {
    test('simple', () => {
        expect(toJsonSchema($string())).toMatchInlineSnapshot(`
                      Object {
                        "schema": Object {
                          "$schema": "http://json-schema.org/draft-07/schema#",
                          "type": "string",
                        },
                      }
              `)
    })

    test('object', () => {
        expect(
            toJsonSchema(
                $object(
                    {
                        foo: $string,
                        bar: $string({ [schema.description]: 'fooscription' }),
                    },
                    { [schema.default]: { foo: 'bar', bar: 'foo' } }
                )
            )
        ).toMatchInlineSnapshot(`
            Object {
              "schema": Object {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "additionalProperties": false,
                "default": Object {
                  "bar": "foo",
                  "foo": "bar",
                },
                "properties": Object {
                  "bar": Object {
                    "description": "fooscription",
                    "type": "string",
                  },
                  "foo": Object {
                    "type": "string",
                  },
                },
                "required": Array [
                  "foo",
                  "bar",
                ],
                "type": "object",
              },
            }
        `)
    })

    test('ref', () => {
        const mocked = uuid as jest.Mock
        mocked.mockReturnValueOnce('0001-000').mockReturnValueOnce('0002-000')

        const foo = $dict($string)
        expect(toJsonSchema($union([$ref({ foo }), $dict($nullable($ref({ foo })))]))).toMatchInlineSnapshot(`
            Object {
              "schema": Object {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "definitions": Object {
                  "{{0002-000}}": Object {
                    "additionalProperties": Object {
                      "type": "string",
                    },
                    "type": "object",
                  },
                },
                "oneOf": Array [
                  Object {
                    "$ref": "#/definitions/{{0002-000}}",
                  },
                  Object {
                    "additionalProperties": Object {
                      "oneOf": Array [
                        Object {
                          "type": "null",
                        },
                        Object {
                          "$ref": "#/definitions/{{0002-000}}",
                        },
                      ],
                    },
                    "type": "object",
                  },
                ],
              },
            }
        `)
    })
})
