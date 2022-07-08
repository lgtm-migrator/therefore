import { $array } from '../../src/lib/types/array'
import { $string } from '../../src/lib/types/string'
import { $union } from '../../src/lib/types/union'

export const plugin = $union([$array($string, { default: ['none'] })], {
    name: 'plugin',
    description: 'Specify the npm plugins that should be loaded. Omit to load all installed plugins.',
})
