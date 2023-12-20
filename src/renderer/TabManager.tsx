import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as storage from './api/storage'
import * as app from './api/app'
import { TabData, TabType } from './api';

type ContextValue = {
  tabs: TabData[];
  addTab: (name: string, type: TabType) => void;
  deleteTab: (id: string) => void;
  selectTab: (id: string) => void;
  toggleActivity: (id: string, hasActivity: boolean) => void;
}
const ctx = React.createContext<ContextValue>(null!)

export const TAB_TYPES = {
  subscription: 'sub',
  topic: 'topic',
} as const

export default function TabManager({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<TabData[]>([])

  const hasAnyActivity = tabs.some((t) => t.activity)

  useEffect(() => {
    storage.get<TabData[]>('tabs.json').then((storageTabs) => {
      if (storageTabs.length === undefined) {
        return
      }
      setTabs(storageTabs)
    })
  }, [])

  useEffect(() => {
    storage.set('tabs.json', tabs)
  }, [tabs])

  useEffect(() => {
    app.setActivity(hasAnyActivity)
  }, [hasAnyActivity])

  const selectTab = useCallback((id: string) => {
    setTabs((state) =>
      state.map((tb) => ({
        ...tb,
        selected: tb.id === id,
      })),
    )
  }, [])
  const addTab = useCallback((name: string, type: TabType) => {
    setTabs((state) => {
      const newTabs = [...state]
      let tab = newTabs.find((t) => t.name === name && t.type === type)
      if (tab === undefined) {
        const newId = `${type}-${name}`
        tab = { id: newId, name, type }
        newTabs.push(tab)
      }
      const id = tab.id

      return newTabs.map((tb) => ({
        ...tb,
        selected: tb.id === id,
      }))
    })
  }, [])
  const deleteTab = useCallback((id: string) => {
    setTabs((state) => state.filter((t) => t.id !== id))
  }, [])
  const toggleActivity = useCallback((id: string, hasActivity: boolean) => {
    setTabs((state) => {
      const newTabs = [...state]
      const tab = newTabs.find((t) => t.id === id)
      if (!tab) {
        return state
      }
      tab.activity = hasActivity
      return newTabs
    })
  }, [])

  const value = useMemo(
    () => ({
      tabs,
      addTab,
      deleteTab,
      selectTab,
      toggleActivity,
    }),
    [tabs],
  )
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const useTabManager = () => {
  const c = useContext(ctx)
  const add = useCallback((name: string, type: TabType) => c.addTab(name, type), [])
  const del = useCallback((id: string) => c.deleteTab(id), [])
  return [add, del] as const
}

export const useTabs = () => {
  const c = useContext(ctx)
  return c.tabs
}

export const useSelectTab = () => {
  const c = useContext(ctx)
  const select = useCallback((id: string) => c.selectTab(id), [])
  return select
}
export const useTabActivityIndicator = (id: string) => {
  const { toggleActivity } = useContext(ctx)
  return useCallback(
    (hasActivity: boolean) => {
      toggleActivity(id, hasActivity)
    },
    [id],
  )
}
