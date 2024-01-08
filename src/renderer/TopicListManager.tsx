import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { create } from "./api/storage"

type PinManagerContext = {
  isPinned: (id: string) => boolean
  pin: (id: string) => void
}

const ctx = createContext<PinManagerContext | null>(null)

export const useIsPinned = () => {
  const context = useContext(ctx)
  const fn = useCallback((id: string) => {
    if (context === null) {
      throw new Error('useIsPinned called outside of PinManager')
    }
    context.isPinned(id)
  }, [context])
  return fn
}
export const usePin = () => {
  const context = useContext(ctx)
  const fn = useCallback((id: string) => {
    if (context === null) {
      throw new Error('useIsPinned called outside of PinManager')
    }
    context.pin(id)
  }, [context])
  return fn
}

const PinManager = ({ children }: { children: ReactNode }) => {
  const [pinned, setPinned] = useState<string[]>([])
  const isPinned = useCallback((id: string) => pinned.includes(id), [pinned])
  const pin = useCallback((id: string) => setPinned((pinned) => [...pinned, id]), [])
  const value = useMemo(() => ({ isPinned, pin }), [isPinned, pin])
  if (pinned === null) {
    return null
  }
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export default PinManager


export const createPinManager = (type: string) => {
  const schema = z.object({
    id: z.string(),
  })
  const storage = create(schema, `${type}-pins.json`)

  const useHook = () => {
    const [pinned, setPinned] = useState<string[]>()
    useEffect(() => {
      storage.getAll()
        .catch(() => {
          return []
        }).then((pinned) => {
          setPinned(pinned.map((p) => p.id))
        })
    }, [])
    useEffect(() => {
      const timer = setTimeout(() => {
        if (pinned !== undefined) {
          storage.setAll(pinned.map((id) => ({ id })))
        }
      }, 5000)
      return () => clearTimeout(timer)
    }, [pinned])
    const togglePinned = useCallback((id: string) => {
      setPinned((pinned) => {
        if (pinned === undefined) {
          return pinned
        }
        if (pinned.includes(id)) {
          return pinned.filter((p) => p !== id)
        }
        return [...pinned, id]
      })
    }, [])
    return [pinned ?? [], togglePinned] as const
  }
  return useHook
}
