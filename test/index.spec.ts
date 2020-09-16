import { therefore } from '~/index'

test('therefore', () => {
    const x = 'foobar' as unknown
    const NumberSchema = {
        assert: (o: unknown): o is string => {
            if (isNaN(Number(o))) {
                throw new Error('was not number')
            }
            return true
        },
    }
    expect(therefore(32, NumberSchema)).toMatchInlineSnapshot(`undefined`)
    expect(() => therefore(x, NumberSchema)).toThrowErrorMatchingInlineSnapshot(`"was not number"`)
})
