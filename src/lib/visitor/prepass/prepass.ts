import type { CstNode } from '../../cst/cst'
import type { CstVisitor } from '../../cst/visitor'
import { walkCst } from '../../cst/visitor'
import { isCstNode } from '../../guard'
import type { ThereforeCst } from '../../types/types'

import { evaluate } from '@zefiros-software/axioms'

export function prepass(obj: ThereforeCst & { prepass?: true }): ThereforeCst & { prepass?: true } {
    const prepassVisitor: CstVisitor<CstNode, unknown, CstNode> = {
        ref: (node) => ({
            ...node,
            // fix the functions to the evaluated format
            children: [evaluate(node.children[0])],
        }),
        default: (node) => {
            return {
                ...node,
                children: node.children?.map((c) => (isCstNode(c) ? walkCst(c, prepassVisitor) : c)),
            }
        },
    }
    if (obj.prepass !== true) {
        return { ...walkCst(obj, prepassVisitor), prepass: true } as ThereforeCst & { prepass?: true }
    }
    return obj
}
