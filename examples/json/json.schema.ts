import type { RefType } from '../../src'
import { $array, $boolean, $dict, $null, $number, $ref, $string, $union } from '../../src'

export const json = $union([$string, $null, $boolean, $number, $dict($ref(() => json)), $array($ref(() => json))])

export const jsonAdv: RefType = $ref(() =>
    $union([$string, $null, $boolean, $number, $dict($ref(() => jsonAdv)), $array($ref(() => jsonAdv))], { name: 'jsonAdv' })
)
