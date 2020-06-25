import { isArray, isDict, isEnum, isExportable, isObject, isShorthand, isTuple } from '~/cli'
import { schema } from '~/therefore'

describe('type guards', () => {
    test('isEnum', () => {
        expect(isEnum({ [schema.type]: 'enum' })).toBeTruthy()
        expect(isEnum({ [schema.type]: 'string' })).toBeFalsy()
    })

    test('isObject', () => {
        expect(isObject({ [schema.type]: 'object' })).toBeTruthy()
        expect(isObject({ [schema.type]: 'string' })).toBeFalsy()
    })

    test('isDict', () => {
        expect(isDict({ [schema.type]: 'dict' })).toBeTruthy()
        expect(isDict({ [schema.type]: 'string' })).toBeFalsy()
    })

    test('isArray', () => {
        expect(isArray({ [schema.type]: 'array' })).toBeTruthy()
        expect(isArray({ [schema.type]: 'string' })).toBeFalsy()
    })

    test('isTuple', () => {
        expect(isTuple({ [schema.type]: 'tuple' })).toBeTruthy()
        expect(isTuple({ [schema.type]: 'string' })).toBeFalsy()
    })

    test('isShorthand', () => {
        expect(isShorthand({ [schema.type]: 'tuple' })).toBeTruthy()
        expect(isShorthand({ [schema.type]: 'object' })).toBeTruthy()
        expect(isShorthand({})).toBeFalsy()
    })

    test('isExportable', () => {
        expect(isExportable({ [schema.type]: 'tuple' })).toBeTruthy()
        expect(isExportable({ [schema.type]: 'dict' })).toBeTruthy()
        expect(isExportable({ [schema.type]: 'object' })).toBeTruthy()
        expect(isExportable({ [schema.type]: 'enum' })).toBeTruthy()
        expect(isExportable({})).toBeFalsy()
    })
})
