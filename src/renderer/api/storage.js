export const get = (key) => window.electronAPI.storage.get(key)
export const set = (key, data) => window.electronAPI.storage.set(key, data)
