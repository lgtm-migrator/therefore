import { toArbitrary } from './arbitrary/arbitrary'
import { toJsonSchema } from './json-schema/json-schema'

import { $array, $null } from '../types'
import { $boolean } from '../types/boolean'
import { $integer } from '../types/integer'
import { $number } from '../types/number'
import { $string } from '../types/string'
import { $unknown } from '../types/unknown'

import { forAll } from '@zefiros-software/axioms'

test('string', () => {
    const arb = $string()
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})

test('number', () => {
    const arb = $number()
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})

test('integer', () => {
    const arb = $integer({ maximum: 600 })
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})

test('boolean', () => {
    const arb = $boolean()
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})

test('null', () => {
    const arb = $null()
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})

test('unknown', () => {
    const arb = $unknown()
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})

test('array', () => {
    const arb = $array($unknown)
    const val = toJsonSchema(arb, true)
    forAll(toArbitrary(arb), (x) => val.validator(x))
})
