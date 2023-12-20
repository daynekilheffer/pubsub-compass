// this is ugly coersed typing
export const get = <T = object>(key: string) => window.electronAPI.invoke.storageGet(key) as Promise<T>
export const set = (key: string, data: object) => window.electronAPI.invoke.storageSet(key, data)
