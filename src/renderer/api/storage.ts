import { z, ZodSchema } from 'zod'

// this is ugly coersed typing
export const get = <T = object>(key: string) => window.electronAPI.invoke.storageGet(key) as Promise<T>
export const set = (key: string, data: object) => {
  window.electronAPI.invoke.storageSet(key, data)
}

export const create = <T extends ZodSchema>(schema: T, key: string) => {
  type StorageType = z.infer<typeof schema>

  const allWrapper = z.promise(z.array(schema))
  return {
    getAll: () => allWrapper.parse(get<StorageType>(key)),
    setAll: (data: StorageType[]) => set(key, data),
  }
}
