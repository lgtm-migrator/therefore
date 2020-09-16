export function renderTemplate(templ: string, data: Record<string, string> = {}): string {
    return templ.replace(/\{\{([^}]+)\}\}/g, (match) => {
        match = match.slice(2, -2)
        const val = data[match]
        return val ?? `{{${match}}}`
    })
}
