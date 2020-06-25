import { filterUndefined, isDefined } from '~/util'

test('isDefined', () => {
    expect(isDefined([])).toBeTruthy()
    expect(isDefined([1])).toBeTruthy()
    expect(isDefined(null)).toBeFalsy()
    expect(isDefined(undefined)).toBeFalsy()
})

test('filterUndefined', () => {
    expect(filterUndefined({})).toMatchInlineSnapshot(`Object {}`)
    expect(filterUndefined({ foo: 'bar', bar: undefined, baz: null })).toMatchInlineSnapshot(`
        Object {
          "baz": null,
          "foo": "bar",
        }
    `)
})
