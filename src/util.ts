export function isDefined<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
}

export function filterUndefined<T, U>(obj: Partial<T> & U): U {
    const lobj: Record<string, unknown> = obj
    for (const key in lobj) {
        if (lobj[key] === undefined) {
            delete lobj[key]
        }
    }
    return obj
}
