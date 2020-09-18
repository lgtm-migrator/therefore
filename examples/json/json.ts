import { $array, $boolean, $dict, $null, $number, $ref, $string, $union } from '~/index'
import type { RefType } from '~/types/composite'

export const json = $union([
    $string,
    $null,
    $boolean,
    $number,
    $dict($ref({ json: () => json })),
    $array($ref({ json: () => json })),
])

export const jsonAdv: RefType = $ref({
    jsonRef: () =>
        $union([
            $string,
            $null,
            $boolean,
            $number,
            $dict($ref({ jsonRef: () => jsonAdv })),
            $array($ref({ jsonRef: () => jsonAdv })),
        ]),
})
