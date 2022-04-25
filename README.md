# ∴ Therefore _(@zefiros/therefore)_

<p>
  <img alt="Lines of code" src="https://img.shields.io/tokei/lines/github/zefiros-software/therefore">
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D12-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Such is the advantage of a well constructed language that its simplified notation often becomes the source of profound theories.
>
> -   Pierre-Simon de Laplace

Therefore empowers you to simply generate JSON Schemas and typescript types.

It is hard to keep JSON Schemas and types aligned, _especially_ in a world of growing api complexity. Therefore, we want to simplify the most frustrating problems associated with JSON validation and typing.

Therefore is:

-   clear; schema definition that reads similar to typescript interfaces
-   clean; generated schemas look similar to hand written types
-   simple; (re)generate schemas with a simple cli command
-   small; Therefore is designed such that it only has to be a _development_ package
-   sensible; don't worry about difficult JSON Schema specifications
-   strict by default; less api-surface, less confusion, happier code
-   static; Therefore does not introduce any runtime, and relies on JSON Schema for validation

## Table of Contents

<!-- toc -->

- [Security](#security)
- [Background](#background)
- [Install](#install)
- [Usage](#usage)
  * [Examples](#examples)
  * [CLI](#cli)
- [API](#api)
- [Alternative projects](#alternative-projects)
- [When not to use Therefore?](#when-not-to-use-therefore)
- [License](#license)

<!-- tocstop -->

## Security

Therefore internally uses [`Ajv`](https://github.com/ajv-validator/ajv) for its validation. This means that the security considerations of using Therefore becomes a superset of those of [`Ajv`](https://github.com/ajv-validator/ajv#security-considerations). By default Therefore tries to implement the strictest interface and validation given a schema. This means that by default: schemas will not allow additional properties to be defined.

## Background

Having runtime validation of your typescript types is not something that is supported out of the box. More than [one](#alternative-projects) have tried to solve this problem. However, many of those implementations - we felt - are too complex. We wanted to separate the validation (a hard problem on itself) and the schema part. And thus, we looked at the different schema validation implementations, where only one really stood out: JSON Schema.

The usage of JSON Schema has grown incredibly over the last few years. Most languages now have a stable validator implementation and OpenAPI (the successor of swagger) fully adopted the JSON Schema specification. As a result, we now have good tools to define and validate API interfaces.

So why not take advantage? There is a problem to successful schema validation in typescript - as we found out -, keeping your schemas synchronized with your code can be incredibly hard without proper tooling. Not only is writing JSON Schema terribly verbose, reading it requires more effort than just glancing a typescript definition. This is not the largest problem, but we strongly believe that schema definitions should be: strict, readable and as concise as possible.

This is where Therefore comes in. Therefore itself does not do **any** validation. At all. Therefore is allows you to write very concise JSON Schemas supported by very good tooling to help you wherever it can. Creating a reference to another variable? No problem. You don't want to export that particular object? Consider it done. You want to reuse the JSON Schema in an OpenAPI specification? Of course, go ahead!

In a nutshell:

1.  You define your schema definitions in files with a specific extension (`.schema.ts` by default)
2.  You run Therefore on the folder `yarn therefore -d src`
3.  Therefore will generate a type file with extension `.type.ts` for you with helper functions of all exported symbols, and in a subfolder `schemas` you will find all generated JSON Schemas waiting for you.
4.  No runtime dependency on Therefore :)

## Install

Install Therefore using [`yarn`](https://yarnpkg.com/):

```console
 $ yarn add --dev @zefiros-software/therefore
```

Or [`npm`](https://www.npmjs.com/):

```console
 $ npm install --save-dev @zefiros-software/therefore
```

## Usage

Let's get started with a simple JSON Schema taken as example:

**example.schema.ts**

```ts
import { $number, $object, $string } from '@zefiros-software/therefore'

export const person = $object({
    firstName: $string({
        description: "The person's first name.",
    }),
    lastName: $string,
    age: $number,
})
```

With this schema defined we can generate the typescript types and JSON schema file:

```console
 $ therefore -d examples/json-schema/
scanning examples/json-schema/example.schema.ts
 - found Person
$ prettier --write examples/json-schema/example.type.ts examples/json-schema/schemas/person.schema.json
examples/json-schema/example.type.ts 149ms
examples/json-schema/schemas/person.schema.json 17ms
Done in 0.41s.
```

<table>
<tr>
<th align="center">
<p>
<small>
Typescript (Output)
</small>
</p>
</th>
<th align="center">
<p>
<small>
JSON Schema (Output)
</small>
</p>
</th>
</tr>
<tr>
<td>

**example.type.ts**

```ts
export interface Person {
    /**
     * The person's first name.
     */
    firstName: string
    lastName: string
    age: number
}

export const Person = {
    schema: personSchema,
    validate: new AjvValidator().compile<Person>(personSchema),
    is: (o: unknown): o is Person => Person.validate(o) === true,
    assert: (o: unknown): asserts o is Person => {
        if (!Person.validate(o)) {
            throw new AjvValidator.ValidationError(Person.validate.errors ?? [])
        }
    },
}
```

</td>
<td>

**schemas/person.schema.json**

```json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "firstName": {
            "type": "string",
            "description": "The person's first name."
        },
        "lastName": {
            "type": "string"
        },
        "age": {
            "type": "number"
        }
    },
    "required": ["firstName", "lastName", "age"],
    "additionalProperties": false
}
```

</td>
</tr>
</table>

### Examples

### CLI

You can run Therefore directly from the CLI

```console
USAGE
 $ therefore

Options:
      --version  Show version number                                   [boolean]
  -f, --file     globs to scan for schemas                               [array]
  -d, --dir      directories                                             [array]
  -e, --exclude  globs to exclude
                   [array] [required] [default: ["**/*.d.ts","node_modules/**"]]
      --fmt                                            [boolean] [default: true]
      --ext                                       [string] [default: ".type.ts"]
      --help     Show help                                             [boolean]
```

## API

## Alternative projects

In no particular order, the following libraries try to solve similar problems (albeit very different):

-   [`Runtypes`](https://github.com/pelotom/runtypes); similar interface, but completely runtime defined.
-   [`TypeBox`](https://github.com/sinclairzx81/typebox)
-   [`io-ts`](https://github.com/gcanti/io-ts)
-   [`joi`](https://github.com/sideway/joi)
-   [`json-schema-to-typescript`](https://github.com/bcherny/json-schema-to-typescript)
-   [`typescript-json-schema`](https://github.com/YousefED/typescript-json-schema)
-   The list goes on....

PR's are very welcome if you think your project is missing here.

## When not to use Therefore?

-   By default we create as strict a JSON Schema/type as possible. We are aware that this doesn't suit everyone's need.
    -   additional properties will result in validation errors **without** extra work
    -   indexable types are always explicitly nullable i.e. `Record<string, string | undefined>` instead of `Record<string, string>`
-   We only support JSON Schema validation through Ajv. If you do not want to/can't use Ajv, Therefore probably isn't for you.
-   Therefore is an insanely opinionated implementation of runtime validation of types, it will not fit for everyone's needs.

## License

Therefore is [MIT licensed](./LICENSE).
