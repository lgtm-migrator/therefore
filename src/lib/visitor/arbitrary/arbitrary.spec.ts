import { toArbitrary } from './arbitrary'

import { $array, $boolean, $integer, $null } from '../../types'
import { $number } from '../../types/number'
import { $string } from '../../types/string'
import { $unknown } from '../../types/unknown'

import { forAll, isInteger, isNumber, isString, isBoolean, isArray, toISO8601Date } from '@zefiros-software/axioms'

test('string', () => {
    forAll(toArbitrary($string()), isString)
})

test('date', () => {
    forAll(toArbitrary<string>($string({ format: 'date' })), (x) => toISO8601Date(new Date(x), { format: 'date' }) === x)
})

test('date-time', () => {
    forAll(toArbitrary<string>($string({ format: 'date-time' })), (x) => toISO8601Date(new Date(x)) === x)
})

test('number', () => {
    forAll(toArbitrary($number()), isNumber)
})

test('integer', () => {
    forAll(toArbitrary($integer()), isNumber)
    forAll(toArbitrary($integer()), isInteger)
})

test('boolean', () => {
    forAll(toArbitrary($boolean()), isBoolean)
})

test('null', () => {
    forAll(toArbitrary($null()), (x) => x === null)
})

test('array', () => {
    forAll(toArbitrary($array($unknown)), isArray)
})
