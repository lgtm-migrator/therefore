import { $number, $object, $string } from '../../src'

export const person = $object({
    firstName: $string({
        description: "The person's first name.",
    }),
    lastName: $string,
    age: $number,
})
