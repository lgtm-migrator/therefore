import type { TypescriptWalkerContext } from './typescript'
import { typeDefinitionVisitor, toTypescriptDefinition, typescriptVisitor, readonly, optional } from './typescript'

import { walkCst } from '../../cst/visitor'
import {
    $array,
    $boolean,
    $dict,
    $enum,
    $integer,
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
} from '../../types'

describe('optional', () => {
    test('false', () => {
        expect(optional({})).toMatchInlineSnapshot(`""`)
        expect(optional({ optional: false })).toMatchInlineSnapshot(`""`)
    })

    test('true', () => {
        expect(optional({ optional: true })).toMatchInlineSnapshot(`"?"`)
    })
})

describe('readonly', () => {
    test('false', () => {
        expect(readonly({ readonly: false })).toMatchInlineSnapshot(`""`)
    })

    test('true', () => {
        expect(readonly({ readonly: true })).toMatchInlineSnapshot(`"readonly "`)
    })
})

describe('typescriptVisitor', () => {
    test('string', () => {
        expect(walkCst($string(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"string"`)
    })

    test('number', () => {
        expect(walkCst($number(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"number"`)
    })

    test('integer', () => {
        expect(walkCst($integer(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"number"`)
    })

    test('boolean', () => {
        expect(walkCst($boolean(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"boolean"`)
    })

    test('null', () => {
        expect(walkCst($null(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"null"`)
    })

    test('unknown', () => {
        expect(walkCst($unknown(), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"unknown"`)
    })

    test('enum', () => {
        expect(
            walkCst($enum(['foo', 'bar', { foo: 'bar' }]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"'foo' | 'bar' | { foo: 'bar' }"`)
    })

    test('array', () => {
        expect(
            walkCst($array($string), typescriptVisitor, {
                locals: {},
                references: [],
                symbolName: '',
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"(string)[]"`)
        expect(
            walkCst($array($enum(['foo', 'bar', { foo: 'bar' }])), typescriptVisitor, {
                locals: {},
                references: [],
                symbolName: '',
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"('foo' | 'bar' | { foo: 'bar' })[]"`)
        expect(
            walkCst($array($union([$string, $integer])), typescriptVisitor, {
                locals: {},
                references: [],
                symbolName: '',
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"({{0007-000}})[]"`)
    })

    test('tuple', () => {
        expect(
            walkCst($tuple([$string, $string, $integer]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"[string, string, number]"`)
    })

    test('named tuple', () => {
        expect(
            walkCst(
                $tuple({
                    foo: $string,
                    boo: $integer,
                }),
                typescriptVisitor,
                {} as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`"[foo: string, boo: number]"`)
        expect(
            walkCst(
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
        expect(walkCst($dict($string), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`
            "{
                [k: string]: ( string ) | undefined
            }"
        `)
    })

    test('ref', () => {
        const foo = $dict($string)
        expect(
            walkCst($ref({ foo }), typescriptVisitor, {
                references: [],
                locals: {},
                symbolName: '',
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"{{0002-000}}"`)
        // test the stable uuid referencing
        expect(
            walkCst($union([$ref({ foo }), $dict($ref({ foo }))]), typescriptVisitor, {
                references: [],
                locals: {},
                symbolName: '',
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            "{{0002-000}} | {
                [k: string]: ( {{0002-000}} ) | undefined
            }"
        `)
    })

    test('union', () => {
        expect(walkCst($union([$string]), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`"string"`)
        expect(
            walkCst($union([$string, $string, $integer]), typescriptVisitor, {} as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`"string | string | number"`)
    })

    test('object', () => {
        expect(walkCst($object({ foo: $string }), typescriptVisitor, {} as TypescriptWalkerContext)).toMatchInlineSnapshot(`
            "{
                foo: string
            }"
        `)
        expect(
            walkCst(
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
            walkCst(
                $object({ foo: $string, bar: $string({ description: 'fooscription' }) }),
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
            walkCst(
                $object({ foo: $string, bar: $string({ description: 'fooscription', readonly: true }) }),
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
    test('string', () => {
        expect(
            walkCst($string(), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('number', () => {
        expect(
            walkCst($number(), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = number
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('integer', () => {
        expect(
            walkCst($integer(), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = number
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('boolean', () => {
        expect(
            walkCst($boolean(), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = boolean
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('null', () => {
        expect(
            walkCst($null(), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = null
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('unknown', () => {
        expect(
            walkCst($unknown(), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = unknown
            ",
              "referenceName": "Foo",
            }
        `)
    })

    test('enum', () => {
        expect(
            walkCst($enum(['foo', 'bar', { foo: 'bar' }]), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = 'foo' | 'bar' | { foo: 'bar' }
            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkCst($enum({ foo: 'bar', bar: 1, baz: true }), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "enum Foo {
                foo = 'bar',
                bar = 1,
                baz = true,
            }

            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkCst($enum({ foo: 'bar', bar: [1, 2, 3] }), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "const FooEnum = {
                foo: 'bar',
                bar: [1, 2, 3],
            } as const
            type Foo = typeof FooEnum

            ",
              "referenceName": "keyof typeof Foo",
            }
        `)
    })

    test('array', () => {
        expect(
            walkCst($array($string), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = (string)[]
            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkCst($array($enum(['foo', 'bar', { foo: 'bar' }])), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = ('foo' | 'bar' | { foo: 'bar' })[]
            ",
              "referenceName": "Foo",
            }
        `)
        const locals = {}
        expect(
            walkCst($array($union([$string, $integer])), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals,
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
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
                "isExported": false,
                "locals": [Circular],
                "referenceName": "FooArray",
                "references": Array [],
                "schema": [Function],
                "sourceSymbol": "FooArray",
                "symbolName": "FooArray",
                "uuid": "0007-000",
              },
            }
        `)
    })

    test('tuple', () => {
        expect(
            walkCst($tuple([$string, $string, $integer]), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
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
            walkCst(
                $tuple({
                    foo: $string,
                    boo: $integer,
                }),

                typeDefinitionVisitor,
                { references: [], symbolName: 'Foo', locals: {} } as unknown as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = [foo: string, boo: number]
            ",
              "referenceName": "Foo",
            }
        `)
        expect(
            walkCst(
                $tuple({
                    x: $number,
                    y: $number,
                    z: $number,
                }),

                typeDefinitionVisitor,
                { references: [], symbolName: 'Foo', locals: {} } as unknown as TypescriptWalkerContext
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
        expect(
            walkCst($dict($string), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                [k: string]: ( string ) | undefined
            }
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
    })

    test('ref', () => {
        const foo = $dict($string)
        expect(
            walkCst($ref({ foo }), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = {{0002-000}}
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
        // test the stable uuid referencing
        expect(
            walkCst($union([$ref({ foo }), $dict($ref({ foo }))]), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = {{0002-000}} | {
                [k: string]: ( {{0002-000}} ) | undefined
            }
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
    })

    test('union', () => {
        expect(
            walkCst($union([$string]), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
        expect(
            walkCst($union([$string, $string, $integer]), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "type Foo = string | string | number
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
    })

    test('object', () => {
        expect(
            walkCst($object({ foo: $string }), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                foo: string
            }
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
        expect(
            walkCst($object({ foo: $string, bar: $nullable($integer), baz: $optional($integer) }), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "interface Foo {
                foo: string
                bar: (number | null)
                baz?: number
            }
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
        expect(
            walkCst($object({ foo: $string, bar: $string({ description: 'fooscription' }) }), typeDefinitionVisitor, {
                references: [],
                symbolName: 'Foo',
                locals: {},
            } as unknown as TypescriptWalkerContext)
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
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
        expect(
            walkCst(
                $object(
                    {
                        foo: $string,
                        bar: $string({ description: 'fooscription' }),
                    },

                    { default: { foo: 'bar', bar: 'foo' } }
                ),

                typeDefinitionVisitor,
                {
                    references: [],
                    symbolName: 'Foo',
                    locals: {},
                } as unknown as TypescriptWalkerContext
            )
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "/**
             * @default { foo: 'bar', bar: 'foo' }
             */
            interface Foo {
                foo: string
                /**
                 * fooscription
                 */
                bar: string
            }
            ",
              "referenceName": "Foo",
              "sourceSymbol": undefined,
            }
        `)
    })

    expect(
        walkCst($object({ foo: $string }, { indexSignature: $number }), typeDefinitionVisitor, {
            references: [],
            symbolName: 'Foo',
            locals: {},
        } as unknown as TypescriptWalkerContext)
    ).toMatchInlineSnapshot(`
        Object {
          "declaration": "interface Foo {
            foo: string
            [k: string]: number
        }
        ",
          "referenceName": "Foo",
          "sourceSymbol": undefined,
        }
    `)
})

describe('toTypescriptDefinition', () => {
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
    //             symbolName: 'Foo',
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
    //             symbolName: 'Foo',
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
    //             symbolName: 'Foo',
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
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $array($string) })).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = (string)[]
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0002-000",
            }
        `)
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $array($enum(['foo', 'bar', { foo: 'bar' }])) }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = ('foo' | 'bar' | { foo: 'bar' })[]
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0004-000",
            }
        `)
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $array($union([$string, $integer])) }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = ({{0007-000}})[]
            ",
              "isExported": true,
              "locals": Object {
                "0007-000": Object {
                  "declaration": "type FooArray = string | number
            ",
                  "isExported": false,
                  "locals": [Circular],
                  "referenceName": "FooArray",
                  "references": Array [],
                  "schema": [Function],
                  "sourceSymbol": "FooArray",
                  "symbolName": "FooArray",
                  "uuid": "0007-000",
                },
              },
              "referenceName": "Foo",
              "references": Array [
                Object {
                  "name": "",
                  "reference": Array [
                    "",
                    Object {
                      "children": Array [
                        Object {
                          "description": Object {},
                          "type": "string",
                          "uuid": "0005-000",
                          "value": Object {},
                        },
                        Object {
                          "description": Object {},
                          "type": "integer",
                          "uuid": "0006-000",
                          "value": Object {},
                        },
                      ],
                      "description": Object {},
                      "type": "union",
                      "uuid": "0007-000",
                      "value": Object {},
                    },
                  ],
                  "referenceName": "",
                  "uuid": "0007-000",
                },
              ],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0008-000",
            }
        `)
    })

    test('tuple', () => {
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $tuple([$string, $string, $integer]) }))
            .toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = [string, string, number]
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0004-000",
            }
        `)
    })

    test('named tuple', () => {
        expect(
            toTypescriptDefinition({
                sourceSymbol: 'foo',
                schema: $tuple({
                    foo: $string,
                    boo: $integer,
                }),
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = [foo: string, boo: number]
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0003-000",
            }
        `)
        expect(
            toTypescriptDefinition({
                sourceSymbol: 'foo',
                schema: $tuple({
                    x: $number,
                    y: $number,
                    z: $number,
                }),
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "export type Foo = [x: number, y: number, z: number]
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0007-000",
            }
        `)
    })

    test('dict', () => {
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $dict($string) })).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                [k: string]: ( string ) | undefined
            }
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0002-000",
            }
        `)
    })

    test('ref', () => {
        const foo = $dict($string)
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $object({ bar: $ref({ foo }) }) })).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                bar: {{0002-000}}
            }
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [
                Object {
                  "name": "foo",
                  "reference": Array [
                    "foo",
                    Object {
                      "children": Array [
                        Object {
                          "description": Object {},
                          "type": "string",
                          "uuid": "0001-000",
                          "value": Object {},
                        },
                      ],
                      "description": Object {},
                      "type": "dict",
                      "uuid": "0002-000",
                      "value": Object {},
                    },
                  ],
                  "referenceName": "Foo",
                  "uuid": "0002-000",
                },
              ],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
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
        expect(toTypescriptDefinition({ sourceSymbol: 'foo', schema: $object({ foo: $string }) })).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                foo: string
            }
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0002-000",
            }
        `)
        expect(
            toTypescriptDefinition({
                sourceSymbol: 'foo',
                schema: $object({ foo: $string, bar: $nullable($integer), baz: $optional($integer) }),
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                foo: string
                bar: (number | null)
                baz?: number
            }
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "0008-000",
            }
        `)
        expect(
            toTypescriptDefinition({
                sourceSymbol: 'foo',
                schema: $object({ foo: $string, bar: $string({ description: 'fooscription' }) }),
            })
        ).toMatchInlineSnapshot(`
            Object {
              "declaration": "export interface Foo {
                foo: string
                /**
                 * fooscription
                 */
                bar: string
            }
            ",
              "isExported": true,
              "locals": Object {},
              "referenceName": "Foo",
              "references": Array [],
              "schema": [Function],
              "sourceSymbol": "foo",
              "symbolName": "Foo",
              "uuid": "00011-000",
            }
        `)
    })
})
