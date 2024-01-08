import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { reset } from './api/subscriptions'
import { Topic, TopicHierarchy, list } from './api/topics'

type ContextValue = {
  topics: TopicHierarchy[] | null
  state: 'loading' | 'loaded'
  refresh: () => void
}

const ctx = createContext<ContextValue | null>(null)

export const useTopics = (): Topic[] => {
  const context = useContext(ctx)
  if (context === null) {
    throw new Error('useTopics called outside of Manager')
  }
  return context.topics?.map((t) => ({
    name: t.name,
  })) ?? []
}

export type Subscription = { name: string, topic: string }
export const useSubscriptions = (): Subscription[] => {
  const context = useContext(ctx)
  if (context === null) {
    throw new Error('useSubscriptions called outside of Manager')
  }
  return context.topics?.flatMap((t) => t.subscriptions.map((s) => ({
    name: s.name,
    topic: t.name,
  }))) ?? []
}

const Manager = ({ children }: { children: React.ReactNode }) => {
  const [topics, setTopics] = useState<TopicHierarchy[] | null>(null)
  const refresh = useCallback(() => {
    list().then((t) => {
      setTopics(t)
    })
  }, [])
  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    reset()
  }, [])
  const value: ContextValue = useMemo(() => ({
    topics,
    state: topics === null ? 'loading' : 'loaded',
    refresh: refresh,
  }), [topics, refresh])
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export default Manager
