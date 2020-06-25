import { $null } from '~/index'

describe('null', () => {
    test('function', () => {
        expect($null).toMatchInlineSnapshot(`[Function]`)
    })
})
