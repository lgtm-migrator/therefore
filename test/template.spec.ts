import { template } from '~/template'

describe('template', () => {
    test('identity for normal strings', () => {
        expect(template('foo')).toMatchInlineSnapshot(`"foo"`)
    })

    test('replace templates', () => {
        expect(template('foo{{bar}}{{2}}', { bar: 'foo', 2: 'bar' })).toMatchInlineSnapshot(`"foofoobar"`)
    })

    test('leave weird nesting', () => {
        expect(template('foo{{bar{{bar}}}}', { bar: 'foo' })).toMatchInlineSnapshot(`"foo{{bar{{bar}}}}"`)
    })
})
