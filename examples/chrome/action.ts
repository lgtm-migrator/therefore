import { uri, icon } from './icon'

import { $string, $object, $ref, $union } from '~/index'

// const action = {
//     type: 'object',
//     properties: {},
//     dependencies: {
//         name: { not: { required: ['name'] } },
//         icons: { not: { required: ['icons'] } },
//         popup: { not: { required: ['popup'] } },
//     },
// }

export const action = $object({
    default_title: $string({
        description: 'Tooltip for the main toolbar icon.',
    }),
    default_popup: $ref({
        [$ref.description]: 'The popup appears when the user clicks the icon.',
        uri,
    }),
    default_icon: $union([
        $string({
            description: 'FIXME: String form is deprecated.',
        }),
        $object({
            [$object.description]: 'Icon for the main toolbar.',
            '19': $ref({ icon }),
            '38': $ref({ icon }),
        }),
    ]),
})
