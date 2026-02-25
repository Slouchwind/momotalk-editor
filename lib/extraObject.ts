export function filterObject<T extends object>(obj: T, filter: (key: string, value: T[keyof T]) => boolean) {
    return Object.fromEntries(Object.entries(obj).filter(([k, v]) => filter(k, v)));
}