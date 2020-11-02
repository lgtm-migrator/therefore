import { $number, $object, $string } from '~/index'

export const person = $object({
    firstName: $string({
        description: "The person's first name.",
    }),
    lastName: $string,
    age: $number,
})
