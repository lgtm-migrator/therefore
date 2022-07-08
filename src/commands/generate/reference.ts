import type { FileDefinition } from './types'

import type { TypescriptReference, TypescriptDefinition } from '../../definition'
import type { ThereforeCst } from '../../lib/types/types'
import { toTypescriptDefinition } from '../../lib/visitor'

import { evaluate } from '@zefiros-software/axioms'

interface ExpandedReference {
    file: string
    symbolName: string
    uuid: string
    referenceName: string
}

const localVersion = new Map<string, number>()
const referenceRegister = new WeakMap<object, string>()

export function requireReference(
    definitions: Record<string, FileDefinition>,
    current: FileDefinition,
    ref: TypescriptReference,
    locals: NonNullable<TypescriptDefinition['locals']>
): ExpandedReference[] {
    const found = Object.values(definitions)
        .flatMap((d) =>
            d.symbols.map((s) => ({
                uuid: s.definition.uuid,
                symbolName: s.definition.symbolName,
                referenceName: s.definition.referenceName,
                file: d.file,
            }))
        )
        .find((s) => s.uuid === ref.uuid)

    if (!found) {
        // this is a locally defined variable
        let sourceSymbol: string
        const [reference] = ref.reference

        const refName = ref.name
        if (refName !== undefined) {
            sourceSymbol = `${refName}Local`
        } else {
            if (!referenceRegister.has(reference)) {
                if (!localVersion.has(current.file)) {
                    localVersion.set(current.file, 0)
                }
                const localIterator = localVersion.get(current.file)!
                referenceRegister.set(reference, `local${localIterator}`)
                localVersion.set(current.file, localIterator + 1)
            }
            sourceSymbol = referenceRegister.get(reference)!
        }

        const definition = toTypescriptDefinition({
            sourceSymbol,
            schema: evaluate(reference) as ThereforeCst,
            exportSymbol: false,
            locals,
        })
        current.symbols.push({
            definition,
            symbolName: sourceSymbol,
            typeOnly: true,
        })

        // make the DFS well defined
        const extra = definition.references.map((r) => requireReference(definitions, current, r, locals)).flat()
        return [
            ...extra,
            {
                file: current.file,
                symbolName: definition.symbolName,
                referenceName: definition.referenceName,
                uuid: ref.uuid,
            },
        ]
    }
    return [
        {
            file: found.file,
            symbolName: found.symbolName,
            referenceName: found.referenceName,
            uuid: ref.uuid,
        },
    ]
}
