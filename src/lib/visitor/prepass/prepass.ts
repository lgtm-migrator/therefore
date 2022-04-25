import type { CstNode } from '../../cst/cst'
import type { CstVisitor } from '../../cst/visitor'
import { walkCst } from '../../cst/visitor'
import type { ThereforeCst } from '../../types/types'

import { evaluate } from '@zefiros-software/axioms'

export function prepass(obj: ThereforeCst & { prepass?: true }): ThereforeCst & { prepass?: true } {
    const prepassVisitor: CstVisitor<CstNode> = {
        union: (node) => {
            return { ...node, children: node.children.map((i) => walkCst(i, prepassVisitor)) }
        },
        object: (node) => {
            return { ...node, children: node.children.map((c) => walkCst(c, prepassVisitor)) }
        },
        array: (node) => {
            return { ...node, children: node.children.map((c) => walkCst(c, prepassVisitor)) }
        },
        tuple: (node) => {
            return { ...node, children: node.children.map((c) => walkCst(c, prepassVisitor)) }
        },
        dict: (node) => {
            return { ...node, children: node.children.map((c) => walkCst(c, prepassVisitor)) }
        },
        ref: (node) => ({
            ...node,
            // fix the functions to the evaluated format
            children: [node.children[0], evaluate(node.children[1])] as const,
        }),
        default: (node) => node,
    }
    if (obj.prepass !== true) {
        return { ...(walkCst(obj, prepassVisitor) as ThereforeCst), prepass: true }
    }
    return obj
}
