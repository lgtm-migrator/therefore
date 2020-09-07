import { schema } from '~/therefore'
import { isShorthand } from '~/types/composite'

test('isShorthand', () => {
    expect(isShorthand({ [schema.type]: 'tuple' })).toBeTruthy()
    expect(isShorthand({ [schema.type]: 'object' })).toBeTruthy()
    expect(isShorthand({})).toBeFalsy()
})
