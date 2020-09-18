import { $array, $number, $ref, $union } from '~/index'

export const simple = $union([$number, $array($ref({ simple: () => simple }))])
