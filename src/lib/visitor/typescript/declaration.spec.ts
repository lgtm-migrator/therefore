import { toDeclaration } from './declaration'
import type { TypescriptWalkerContext } from './typescript'

import { $object, $string, $union, $unknown } from '../../types'

import { forAll, string, tuple, alphaString } from '@zefiros-software/axioms'
import * as ts from 'typescript'

test('object declaration', () => {
    forAll(tuple(string(), alphaString({ minLength: 1 })), ([key, name]) => {
        const { declaration } = toDeclaration($object({ [key]: $unknown() }), {
            name,
        } as unknown as TypescriptWalkerContext)
        return ts.transpileModule(declaration, { reportDiagnostics: true }).diagnostics?.length === 0
    })
})

test('type declaration', () => {
    forAll(alphaString({ minLength: 1 }), (name) => {
        const { declaration } = toDeclaration($union([$string(), $string()]), {
            name,
        } as unknown as TypescriptWalkerContext)
        return ts.transpileModule(declaration, { reportDiagnostics: true }).diagnostics?.length === 0
    })
})
