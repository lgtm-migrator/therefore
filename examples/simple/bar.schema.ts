import { foo } from './foo.schema'

import { $object, $ref } from '../../src'

export const bar = $object({
    foo: $ref(foo),
})
