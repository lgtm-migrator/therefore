jest.mock('uuid')

import { mockUuid } from './util'

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
import type { TypescriptWalkerContext } from '~/typescript'
import {
    optional,
    readonly,
    toJSDoc,
    toLiteral,
    toTypescriptDefinition,
    typeDefinitionVisitor,
    typescriptVisitor,
} from '~/typescript'
import { schema } from '~/therefore'
import { walkGraph } from '~/ast'

import { v4 as uuid } from 'uuid'

describe('literals', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('object', () => {
        expect(toLiteral({})).toMatchInlineSnapshot(`"{  }"`)
        expect(toLiteral({ foo: 'bar', baz: { boo: 1 }, boo: [123] })).toMatchInlineSnapshot(
            `"{ foo: 'bar'; baz: { boo: 1 }; boo: [123] }"`
        )
    })

    test('array', () => {
        expect(toLiteral([])).toMatchInlineSnapshot(`"[]"`)
        expect(toLiteral([1, 2, 3])).toMatchInlineSnapshot(`"[1, 2, 3]"`)
        expect(toLiteral([1, 'foo', { foo: 'bar' }])).toMatchInlineSnapshot(`"[1, 'foo', { foo: 'bar' }]"`)
    })

    test('number', () => {
        expect(toLiteral(1)).toMatchInlineSnapshot(`"1"`)
        expect(toLiteral(3.14)).toMatchInlineSnapshot(`"3.14"`)
    })

    test.skip('bigint', () => {
        //expect(toLiteral(1n)).toMatchInlineSnapshot()
    })

    test('string', () => {
        expect(toLiteral('foo')).toMatchInlineSnapshot(`"'foo'"`)
    })

    test('boolean', () => {
        expect(toLiteral(true)).toMatchInlineSnapshot(`"true"`)
        expect(toLiteral(false)).toMatchInlineSnapshot(`"false"`)
    })

    test('undefined', () => {
        expect(toLiteral(undefined)).toMatchInlineSnapshot(`"null"`)
    })

    test('null', () => {
        expect(toLiteral(null)).toMatchInlineSnapshot(`"null"`)
    })

    test('other', () => {
        expect(() => toLiteral(Symbol())).toThrowErrorMatchingInlineSnapshot(`"not supported"`)
        expect(() => toLiteral(() => 1)).toThrowErrorMatchingInlineSnapshot(`"not supported"`)
    })
})

describe('toJSDoc', () => {
    test('description', () => {
        expect(toJSDoc('foo', { [schema.type]: 'string', [schema.description]: 'lorum ipsum' })).toMatchInlineSnapshot(`
            "/**
             * lorum ipsum
             */
            "
        `)
    })

    test('examples', () => {
        expect(toJSDoc('foo', { [schema.type]: 'string', [schema.examples]: [] })).toMatchInlineSnapshot(`undefined`)
        expect(toJSDoc('foo', { [schema.type]: 'string', [schema.examples]: ['lorum ipsum', 'dolor sit amet'] }))
            .toMatchInlineSnapshot(`
            "/**
             * @example foo = 'lorum ipsum'
             * @example foo = 'dolor sit amet'
             */
            "
        `)
    })

    test('default', () => {
        expect(toJSDoc('foo', { [schema.type]: 'string', [schema.default]: [] })).toMatchInlineSnapshot(`
            "/**
             * @default []
             */
            "
        `)
        expect(toJSDoc('foo', { [schema.type]: 'string', [schema.default]: 'lorum ipsum' })).toMatchInlineSnapshot(`
            "/**
             * @default 'lorum ipsum'
             */
            "
        `)
    })

    test('combined', () => {
        expect(
            toJSDoc('foo', {
                [schema.type]: 'string',
                [schema.description]: 'lorum ipsum',
                [schema.default]: 'dolor sit amet',
                [schema.examples]: ['lorum ipsum', 'dolor sit amet'],
            })
        ).toMatchInlineSnapshot(`
            "/**
             * lorum ipsum
             * 
             * @default 'dolor sit amet'
             * 
             * @example foo = 'lorum ipsum'
             * @example foo = 'dolor sit amet'
             */
            "
        `)
    })
})

describe('optional', () => {
    test('false', () => {
        expect(optional({ [schema.type]: 'string' })).toMatchInlineSnapshot(`""`)
        expect(optional({ [schema.type]: 'string', [schema.optional]: false })).toMatchInlineSnapshot(`""`)
    })

    test('true', () => {
        expect(optional({ [schema.type]: 'string', [schema.optional]: true })).toMatchInlineSnapshot(`"?"`)
    })
})

describe('readonly', () => {
    test('false', () => {
        expect(readonly({ [schema.type]: 'string', [schema.readonly]: false })).toMatchInlineSnapshot(`""`)
    })

    test('true', () => {
        expect(readonly({ [schema.type]: 'string', [schema.readonly]: true })).toMatchInlineSnapshot(`"readonly "`)
    })
})

describe('typescriptVisitor', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('string', () => {
        expect(walkGraph($string(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"string"`)
    })

    test('number', () => {
        expect(walkGraph($number(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"number"`)
    })

    test('integer', () => {
        expect(walkGraph($integer(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"number"`)
    })

    test('boolean', () => {
        expect(walkGraph($boolean(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"boolean"`)
    })

    test('null', () => {
        expect(walkGraph($null(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"null"`)
    })

    test('unknown', () => {
        expect(walkGraph($unknown(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"unknown"`)
    })

    test('enum', () => {
        expect(
            walkGraph($enum(['foo', 'bar', { foo: 'bar' }]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"'foo' | 'bar' | { foo: 'bar' }"`)
    })

    test('array', () => {
        expect(walkGraph($array($string), typescriptVisitor, { locals: {}, references: [], name: '' })).toMatchInlineSnapshot(
            `"(string)[]"`
        )
        expect(
            walkGraph($array($enum(['foo', 'bar', { foo: 'bar' }])), typescriptVisitor, { locals: {}, references: [], name: '' })
        ).toMatchInlineSnapshot(`"('foo' | 'bar' | { foo: 'bar' })[]"`)
        expect(
            walkGraph($array($union([$string, $integer])), typescriptVisitor, { locals: {}, references: [], name: '' })
        ).toMatchInlineSnapshot(`"({{0007-000}})[]"`)
    })

    test('tuple', () => {
        expect(
            walkGraph($tuple([$string, $string, $integer]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"[string, string, number]"`)
    })

    test('named tuple', () => {
        expect(
            walkGraph(
                $tuple({
                    foo: $string,
                    boo: $integer,
                }),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`"[foo: string, boo: number]"`)
        expect(
            walkGraph(
                $tuple({
                    x: $number,
                    y: $number,
                    z: $number,
                }),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`"[x: number, y: number, z: number]"`)
    })

    test('dict', () => {
        expect(walkGraph($dict($string), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`
            "{
                [k: string]: ( string ) | undefined
            }"
        `)
    })

    test('ref', () => {
        const foo = $dict($string)
        expect(
            walkGraph($ref({ foo }), typescriptVisitor, {
                references: [],
                locals: {},
                name: '',
            } as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"{{0002-000}}"`)
        // test the stable uuid referencing
        expect(
            walkGraph($union([$ref({ foo }), $dict($ref({ foo }))]), typescriptVisitor, {
                references: [],
                locals: {},
                name: '',
            } as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            "{{0002-000}} | {
                [k: string]: ( {{0002-000}} ) | undefined
            }"
        `)
    })

    test('union', () => {
        expect(walkGraph($union([$string]), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"string"`)
        expect(
            walkGraph($union([$string, $string, $integer]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"string | string | number"`)
    })

    test('intersection', () => {
        expect(walkGraph($intersection([$string]), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(
            `"(string)"`
        )
        expect(
            walkGraph($intersection([$string, $integer]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"(string & number)"`)
    })

    test('union & intersection', () => {
        expect(
            walkGraph(
                $union([$string, $intersection([$string, $integer]), $integer]),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`"string | (string & number) | number"`)
    })

    test('object', () => {
        expect(walkGraph($object({ foo: $string }), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`
            "{
                foo: string
            }"
        `)
        expect(
            walkGraph(
                $object({ foo: $string, bar: $nullable($integer), baz: $optional($integer) }),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`
            "{
                foo: string
                bar: (number | null)
                baz?: number
            }"
        `)
        expect(
            walkGraph(
                $object({ foo: $string, bar: $string({ [schema.description]: 'fooscription' }) }),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`
            "{
                foo: string
                /**
                 * fooscription
                 */
                bar: string
            }"
        `)
        expect(
            walkGraph(
                $object({ foo: $string, bar: $string({ [schema.description]: 'fooscription', [schema.readonly]: true }) }),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`
            "{
                foo: string
                /**
                 * fooscription
                 * 
                 * @readonly
                 */
                readonly bar: string
            }"
        `)
    })
})

describe('toTypeDefinition', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    test('string', () => {
        expect(walkGraph($string(), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('number', () => {
        expect(walkGraph($number(), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = number
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('integer', () => {
        expect(walkGraph($integer(), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = number
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('boolean', () => {
        expect(walkGraph($boolean(), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = boolean
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('null', () => {
        expect(walkGraph($null(), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = null
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('unknown', () => {
        expect(walkGraph($unknown(), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = unknown
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('enum', () => {
        expect(
            walkGraph($enum(['foo', 'bar', { foo: 'bar' }]), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = 'foo' | 'bar' | { foo: 'bar' }
            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph($enum({ foo: 'bar', bar: 1, baz: true }), typeDefinitionVisitor, {
                references: [],
                name: 'Foo',
                locals: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "enum Foo {
                foo = 'bar',
                bar = 1,
                baz = true,
            }

            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph($enum({ foo: 'bar', bar: [1, 2, 3] }), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "const Foo = {
                foo: 'bar' as const,
                bar: [1, 2, 3] as const,
            }

            ",
              "meta": undefined,
              "referenceName": "keyof typeof Foo",
            }
        `)
    })

    test('array', () => {
        expect(walkGraph($array($string), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = (string)[]
            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph($array($enum(['foo', 'bar', { foo: 'bar' }])), typeDefinitionVisitor, {
                references: [],
                name: 'Foo',
                locals: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = ('foo' | 'bar' | { foo: 'bar' })[]
            ",
              "referenceName": "Foo",
            }
        `)
        const locals = {}
        expect(walkGraph($array($union([$string, $integer])), typeDefinitionVisitor, { references: [], name: 'Foo', locals }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = ({{0007-000}})[]
            ",
              "referenceName": "Foo",
            }
        `)
        expect(locals).toMatchInlineSnapshot(`
            Object {
              "0007-000": Object {
                "declaration": "type FooArray = string | number
            ",
                "interfaceName": "FooArray",
                "locals": [Circular],
                "meta": undefined,
                "referenceName": "FooArray",
                "references": Array [],
                "symbolName": "FooArray",
                "uuid": "0007-000",
              },
            }
        `)
    })

    test('tuple', () => {
        expect(
            walkGraph($tuple([$string, $string, $integer]), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = [string, string, number]
            ",
              "referenceName": "Foo",
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
                typeDefinitionVisitor,
                { references: [], name: 'Foo', locals: {} }
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = [foo: string, boo: number]
            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph(
                $tuple({
                    x: $number,
                    y: $number,
                    z: $number,
                }),
                typeDefinitionVisitor,
                { references: [], name: 'Foo', locals: {} }
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = [x: number, y: number, z: number]
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('dict', () => {
        expect(walkGraph($dict($string), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                [k: string]: ( string ) | undefined
            }
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
    })

    test('ref', () => {
        const foo = $dict($string)
        expect(walkGraph($ref({ foo }), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = {{0002-000}}
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
        // test the stable uuid referencing
        expect(
            walkGraph($union([$ref({ foo }), $dict($ref({ foo }))]), typeDefinitionVisitor, {
                references: [],
                name: 'Foo',
                locals: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = {{0002-000}} | {
                [k: string]: ( {{0002-000}} ) | undefined
            }
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
    })

    test('union', () => {
        expect(walkGraph($union([$string]), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph($union([$string, $string, $integer]), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string | string | number
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
    })

    test('intersection', () => {
        expect(walkGraph($intersection([$string]), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = (string)
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
        expect(walkGraph($intersection([$string, $integer]), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = (string & number)
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
    })

    test('union & intersection', () => {
        expect(
            walkGraph($union([$string, $intersection([$string, $integer]), $integer]), typeDefinitionVisitor, {
                references: [],
                name: 'Foo',
                locals: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string | (string & number) | number
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
    })

    test('object', () => {
        expect(walkGraph($object({ foo: $string }), typeDefinitionVisitor, { references: [], name: 'Foo', locals: {} }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                foo: string
            }
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph($object({ foo: $string, bar: $nullable($integer), baz: $optional($integer) }), typeDefinitionVisitor, {
                references: [],
                name: 'Foo',
                locals: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                foo: string
                bar: (number | null)
                baz?: number
            }
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
        expect(
            walkGraph($object({ foo: $string, bar: $string({ [schema.description]: 'fooscription' }) }), typeDefinitionVisitor, {
                references: [],
                name: 'Foo',
                locals: {},
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                foo: string
                /**
                 * fooscription
                 */
                bar: string
            }
            ",
              "meta": undefined,
              "referenceName": "Foo",
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
                typeDefinitionVisitor,
                {
                    references: [],
                    name: 'Foo',
                    locals: {},
                }
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "/**
             * @default { foo: 'bar'; bar: 'foo' }
             */
            interface Foo {
                foo: string
                /**
                 * fooscription
                 */
                bar: string
            }
            ",
              "meta": undefined,
              "referenceName": "Foo",
            }
        `)
    })
})

describe('toTypescriptDefinition', () => {
    beforeEach(() => (uuid as jest.Mock).mockImplementation(mockUuid()))

    // test('string', () => {
    //     expect(toTypescriptDefinition('foo', $string()).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = string
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    // })

    // test('number', () => {
    //     expect(toTypescriptDefinition('foo', $number())).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = number
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    // })

    // test('integer', () => {
    //     expect(toTypescriptDefinition('foo', $integer())).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = number
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    // })

    // test('boolean', () => {
    //     expect(toTypescriptDefinition('foo', $boolean())).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = boolean
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    // })

    // test('null', () => {
    //     expect(toTypescriptDefinition('foo', $null())).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = null
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    // })

    // test('unknown', () => {
    //     expect(toTypescriptDefinition('foo', $unknown())).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = unknown
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    // })

    // test('enum', () => {
    //     expect(
    //         toTypescriptDefinition('foo', $enum(['foo', 'bar', { foo: 'bar' }]), typeDefinitionVisitor, {
    //             references: [],
    //             name: 'Foo',
    //         })
    //     ).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export type Foo = 'foo' | 'bar' | { foo: 'bar' }
    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    //     expect(
    //         toTypescriptDefinition('foo', $enum({ foo: 'bar', bar: 1, baz: true }), typeDefinitionVisitor, {
    //             references: [],
    //             name: 'Foo',
    //         })
    //     ).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export enum Foo {
    //             foo = 'bar',
    //             bar = 1,
    //             baz = true,
    //         }

    //         ",
    //           "referenceName": "Foo",
    //         }
    //     `)
    //     expect(
    //         toTypescriptDefinition('foo', $enum({ foo: 'bar', bar: [1, 2, 3] }), typeDefinitionVisitor, {
    //             references: [],
    //             name: 'Foo',
    //         })
    //     ).toMatchInlineSnapshot(`
    //         Object {
    //           "declaration": "export const Foo = {
    //             foo: 'bar' as const,
    //             bar: [1, 2, 3] as const,
    //         }

    //         ",
    //           "referenceName": "keyof typeof Foo",
    //         }
    //     `)
    // })

    test('array', () => {
        expect(toTypescriptDefinition('foo', $array($string))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = (string)[]
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": undefined,
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0002-000",
            }
        `)
        expect(toTypescriptDefinition('foo', $array($enum(['foo', 'bar', { foo: 'bar' }])))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = ('foo' | 'bar' | { foo: 'bar' })[]
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": undefined,
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0004-000",
            }
        `)
        expect(toTypescriptDefinition('foo', $array($union([$string, $integer])))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = ({{0007-000}})[]
            ",
              "interfaceName": "Foo",
              "locals": Object {
                "0007-000": Object {
                  "declaration": "type FooArray = string | number
            ",
                  "interfaceName": "FooArray",
                  "locals": [Circular],
                  "meta": undefined,
                  "referenceName": "FooArray",
                  "references": Array [],
                  "symbolName": "FooArray",
                  "uuid": "0007-000",
                },
              },
              "meta": undefined,
              "referenceName": "Foo",
              "references": Array [
                Object {
                  "name": "undefined",
                  "reference": Object {
                    "type": "union",
                    "union": Array [
                      Object {
                        "type": "string",
                        "uuid": "0005-000",
                      },
                      Object {
                        "type": "integer",
                        "uuid": "0006-000",
                      },
                    ],
                    "uuid": "0007-000",
                  },
                  "referenceName": "Undefined",
                  "uuid": "0007-000",
                },
              ],
              "symbolName": "foo",
              "uuid": "0008-000",
            }
        `)
    })

    test('tuple', () => {
        expect(toTypescriptDefinition('foo', $tuple([$string, $string, $integer]))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = [string, string, number]
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": undefined,
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0004-000",
            }
        `)
    })

    test('named tuple', () => {
        expect(
            toTypescriptDefinition(
                'foo',
                $tuple({
                    foo: $string,
                    boo: $integer,
                })
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = [foo: string, boo: number]
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": undefined,
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0003-000",
            }
        `)
        expect(
            toTypescriptDefinition(
                'foo',
                $tuple({
                    x: $number,
                    y: $number,
                    z: $number,
                })
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = [x: number, y: number, z: number]
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": undefined,
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0007-000",
            }
        `)
    })

    test('dict', () => {
        expect(toTypescriptDefinition('foo', $dict($string))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                [k: string]: ( string ) | undefined
            }
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": "export const Foo = {
                schema: {{schema}},
                validate: typeof {{schema}} === 'function' ? {{schema}} : new AjvValidator().compile({{schema}}) as {(o: unknown | Foo): o is Foo;  errors?: null | Array<import(\\"ajv\\").ErrorObject>},
                is: (o: unknown | Foo): o is Foo => Foo.validate(o) === true,
                assert: (o: unknown | Foo): asserts o is Foo => {
                    if (!Foo.validate(o)) {
                        throw new AjvValidator.ValidationError(Foo.validate.errors ?? [])
                    }
                },
            }

            ",
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0002-000",
            }
        `)
    })

    test('ref', () => {
        const foo = $dict($string)
        expect(toTypescriptDefinition('foo', $object({ bar: $ref({ foo }) }))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                bar: {{0002-000}}
            }
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": "export const Foo = {
                schema: {{schema}},
                validate: typeof {{schema}} === 'function' ? {{schema}} : new AjvValidator().compile({{schema}}) as {(o: unknown | Foo): o is Foo;  errors?: null | Array<import(\\"ajv\\").ErrorObject>},
                is: (o: unknown | Foo): o is Foo => Foo.validate(o) === true,
                assert: (o: unknown | Foo): asserts o is Foo => {
                    if (!Foo.validate(o)) {
                        throw new AjvValidator.ValidationError(Foo.validate.errors ?? [])
                    }
                },
            }

            ",
              "referenceName": "Foo",
              "references": Array [
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
                  "referenceName": "Foo",
                  "uuid": "0002-000",
                },
              ],
              "symbolName": "foo",
              "uuid": "0004-000",
            }
        `)
        // expect(toTypescriptDefinition('foo', $ref({ foo }))).toMatchInlineSnapshot(`
        //     Object {
        //       "interface": Object {
        //         "declaration": "export type Foo = {{0001-000}}
        //     ",
        //         "interfaceName": "Foo",
        //         "meta": undefined,
        //         "referenceName": "Foo",
        //         "symbolName": "foo",
        //         "uuid": undefined,
        //       },
        //       "references": Array [
        //         Object {
        //           "hash": "0001-000",
        //           "name": "foo",
        //         },
        //       ],
        //     }
        // `)
        // // test the stable uuid referencing
        // expect(toTypescriptDefinition('foo', $union([$ref({ foo }), $dict($ref({ foo }))]))).toMatchInlineSnapshot(`
        //     Object {
        //       "interface": Object {
        //         "declaration": "export type Foo = {{0001-000}} | {
        //         [k: string]: ( {{0001-000}} ) | undefined
        //     }
        //     ",
        //         "interfaceName": "Foo",
        //         "meta": undefined,
        //         "referenceName": "Foo",
        //         "symbolName": "foo",
        //         "uuid": undefined,
        //       },
        //       "references": Array [
        //         Object {
        //           "hash": "0001-000",
        //           "name": "foo",
        //         },
        //       ],
        //     }
        // `)
    })

    // test('union', () => {
    //     expect(toTypescriptDefinition('foo', $union([$string]))).toMatchInlineSnapshot(`
    //         Object {
    //           "interface": Object {
    //             "declaration": "export type Foo = string
    //         ",
    //             "interfaceName": "Foo",
    //             "meta": undefined,
    //             "referenceName": "Foo",
    //             "symbolName": "foo",
    //             "uuid": undefined,
    //           },
    //           "references": Array [],
    //         }
    //     `)
    //     expect(toTypescriptDefinition('foo', $union([$string, $string, $integer]))).toMatchInlineSnapshot(`
    //         Object {
    //           "interface": Object {
    //             "declaration": "export type Foo = string | string | number
    //         ",
    //             "interfaceName": "Foo",
    //             "meta": undefined,
    //             "referenceName": "Foo",
    //             "symbolName": "foo",
    //             "uuid": undefined,
    //           },
    //           "references": Array [],
    //         }
    //     `)
    // })

    // test('intersection', () => {
    //     expect(toTypescriptDefinition('foo', $intersection([$string]))).toMatchInlineSnapshot(`
    //         Object {
    //           "interface": Object {
    //             "declaration": "export type Foo = (string)
    //         ",
    //             "interfaceName": "Foo",
    //             "meta": undefined,
    //             "referenceName": "Foo",
    //             "symbolName": "foo",
    //             "uuid": undefined,
    //           },
    //           "references": Array [],
    //         }
    //     `)
    //     expect(toTypescriptDefinition('foo', $intersection([$string, $integer]))).toMatchInlineSnapshot(`
    //         Object {
    //           "interface": Object {
    //             "declaration": "export type Foo = (string & number)
    //         ",
    //             "interfaceName": "Foo",
    //             "meta": undefined,
    //             "referenceName": "Foo",
    //             "symbolName": "foo",
    //             "uuid": undefined,
    //           },
    //           "references": Array [],
    //         }
    //     `)
    // })

    // test('union & intersection', () => {
    //     expect(toTypescriptDefinition('foo', $union([$string, $intersection([$string, $integer]), $integer])))
    //         .toMatchInlineSnapshot(`
    //         Object {
    //           "interface": Object {
    //             "declaration": "export type Foo = string | (string & number) | number
    //         ",
    //             "interfaceName": "Foo",
    //             "meta": undefined,
    //             "referenceName": "Foo",
    //             "symbolName": "foo",
    //             "uuid": undefined,
    //           },
    //           "references": Array [],
    //         }
    //     `)
    // })

    test('object', () => {
        expect(toTypescriptDefinition('foo', $object({ foo: $string }))).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                foo: string
            }
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": "export const Foo = {
                schema: {{schema}},
                validate: typeof {{schema}} === 'function' ? {{schema}} : new AjvValidator().compile({{schema}}) as {(o: unknown | Foo): o is Foo;  errors?: null | Array<import(\\"ajv\\").ErrorObject>},
                is: (o: unknown | Foo): o is Foo => Foo.validate(o) === true,
                assert: (o: unknown | Foo): asserts o is Foo => {
                    if (!Foo.validate(o)) {
                        throw new AjvValidator.ValidationError(Foo.validate.errors ?? [])
                    }
                },
            }

            ",
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0002-000",
            }
        `)
        expect(toTypescriptDefinition('foo', $object({ foo: $string, bar: $nullable($integer), baz: $optional($integer) })))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                foo: string
                bar: (number | null)
                baz?: number
            }
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": "export const Foo = {
                schema: {{schema}},
                validate: typeof {{schema}} === 'function' ? {{schema}} : new AjvValidator().compile({{schema}}) as {(o: unknown | Foo): o is Foo;  errors?: null | Array<import(\\"ajv\\").ErrorObject>},
                is: (o: unknown | Foo): o is Foo => Foo.validate(o) === true,
                assert: (o: unknown | Foo): asserts o is Foo => {
                    if (!Foo.validate(o)) {
                        throw new AjvValidator.ValidationError(Foo.validate.errors ?? [])
                    }
                },
            }

            ",
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0006-000",
            }
        `)
        expect(toTypescriptDefinition('foo', $object({ foo: $string, bar: $string({ [schema.description]: 'fooscription' }) })))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                foo: string
                /**
                 * fooscription
                 */
                bar: string
            }
            ",
              "interfaceName": "Foo",
              "locals": Object {},
              "meta": "export const Foo = {
                schema: {{schema}},
                validate: typeof {{schema}} === 'function' ? {{schema}} : new AjvValidator().compile({{schema}}) as {(o: unknown | Foo): o is Foo;  errors?: null | Array<import(\\"ajv\\").ErrorObject>},
                is: (o: unknown | Foo): o is Foo => Foo.validate(o) === true,
                assert: (o: unknown | Foo): asserts o is Foo => {
                    if (!Foo.validate(o)) {
                        throw new AjvValidator.ValidationError(Foo.validate.errors ?? [])
                    }
                },
            }

            ",
              "referenceName": "Foo",
              "references": Array [],
              "symbolName": "foo",
              "uuid": "0009-000",
            }
        `)
    })
})
