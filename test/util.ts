export function mockUuid(): () => string {
    let value = 1
    return () => `000${(value++).toString()}-000`
}
