import { $number, $object, $ref } from '../../src'

const localFoo = $object({ x: $number() })

export const foo = $object({
    foo: $ref(localFoo),
})
