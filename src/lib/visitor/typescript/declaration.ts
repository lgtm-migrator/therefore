import { toJSDoc } from './jsdoc'
import type { TypescriptWalkerContext } from './typescript'
import { typescriptVisitor } from './typescript'

import { walkCst } from '../../cst/visitor'
import type { DictType, ObjectType, RefType, UnionType } from '../../types'

export interface DeclarationOutput {
    declaration: string
    referenceName: string
    sourceSymbol: string | undefined
}

export function toDeclaration(
    obj: DictType | ObjectType | RefType | UnionType,
    context: TypescriptWalkerContext
): DeclarationOutput {
    const { symbolName, exportKeyword, sourceSymbol } = context
    const exportString = exportKeyword ?? ''
    const [declType, operator] = obj.type === 'dict' || obj.type === 'object' ? ['interface', ''] : ['type', '= ']
    return {
        declaration: `${toJSDoc(symbolName, obj.description) ?? ''}${exportString}${declType} ${symbolName} ${operator}${walkCst(
            obj,
            typescriptVisitor,
            context
        )}\n`,
        referenceName: symbolName,
        sourceSymbol,
    }
}
