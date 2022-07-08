import { $array, $number, $ref, $union } from '../../src'

export const simple = $union([$number, $array($ref(() => simple))])

export default {
    simple,
}
