import { $number, $object, $ref, $union } from '../../src'

export const square = $object({
    size: $number,
})

export const rectangle = $object({
    width: $number,
    height: $number,
})

export const circle = $object({
    radius: $number,
})

export const shape = $union([$ref({ square }), $ref({ rectangle }), $ref({ circle })])
