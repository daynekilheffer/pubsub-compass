import storage from 'electron-json-storage'

export default {
  get: (key: string) => {
    return new Promise<object>((resolve, reject) => {
      storage.get(key, (err, data) => {
        if (err) {
          reject(err)
          return
        }
        resolve(data)
      })
    })
  },
  set: (key: string, json: object) => {
    return new Promise<void>((resolve, reject) => {
      storage.set(key, json, (err) => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  },
  has: (key: string) => {
    return new Promise<boolean>((resolve, reject) => {
      storage.has(key, (err, exists) => {
        if (err) {
          reject(err)
          return
        }
        resolve(!!exists)
      })
    })
  },
}
