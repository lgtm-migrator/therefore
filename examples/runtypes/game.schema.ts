import { $number, $object, $union, $enum, $tuple, $ref, $boolean, $string, $array, $dict } from '~/index'

const nonNegative = $number({
    minimum: 0,
})

const vector = $tuple([$number, $number, $number])

export const asteroid = $object({
    type: $enum(['asteroid']),
    location: $ref({ vector }),
    mass: nonNegative,
})

export const planet = $object({
    type: $enum(['planet']),
    location: $ref({ vector }),
    mass: nonNegative,
    population: nonNegative,
    habitable: $boolean,
})

export const rank = $enum(['captain', 'first mate', 'officer', 'ensign'])

export const crewMember = $object({
    name: $string,
    age: nonNegative,
    rank: $ref({ rank }),
    home: $ref({ planet }),
})

export const ship = $object({
    type: $enum(['ship']),
    location: $ref({ vector }),
    mass: nonNegative,
    name: $string,
    crew: $array($ref({ crewMember })),
})

export const fleet = $dict($ref({ ship }))
export const spaceObject = $union([$ref({ asteroid }), $ref({ planet }), $ref({ ship })])