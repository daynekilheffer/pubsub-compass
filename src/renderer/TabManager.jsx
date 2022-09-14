import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import * as storage from './api/storage'

const ctx = React.createContext(null)

export const TAB_TYPES = {
  subscription: 'sub',
  topic: 'topic',
}

export default function TabManager({ children }) {
  const [tabs, setTabs] = useState([])

  useEffect(() => {
    storage.get('tabs.json').then((storageTabs) => {
      if (!storageTabs.length) {
        return
      }
      setTabs(storageTabs)
    })
  }, [])

  useEffect(() => {
    storage.set('tabs.json', tabs)
  }, [tabs])

  const selectTab = useCallback((id) => {
    setTabs((state) =>
      state.map((tb) => ({
        ...tb,
        selected: tb.id === id,
      })),
    )
  }, [])
  const addTab = useCallback((name, type) => {
    setTabs((state) => {
      const newTabs = [...state]
      let tab = newTabs.find((t) => t.name === name && t.type === type)
      if (!tab) {
        const newId = `${type}-${name}`
        tab = { id: newId, name, type }
        newTabs.push(tab)
      }

      return newTabs.map((tb) => ({
        ...tb,
        selected: tb.id === tab.id,
      }))
    })
  }, [])
  const deleteTab = useCallback((id) => {
    setTabs((state) => state.filter((t) => t.id !== id))
  }, [])
  const toggleActivity = useCallback((id, hasActivity) => {
    setTabs((state) => {
      const newTabs = [...state]
      const tab = newTabs.find((t) => t.id === id)
      if (!tab) {
        return
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
  const add = useCallback((name, type) => c.addTab(name, type), [])
  const del = useCallback((id) => c.deleteTab(id), [])
  return [add, del]
}

export const useTabs = () => {
  const c = useContext(ctx)
  return c.tabs
}

export const useSelectTab = () => {
  const c = useContext(ctx)
  const select = useCallback((id) => c.selectTab(id), [])
  return select
}
export const useTabActivityIndicator = (id) => {
  const { toggleActivity } = useContext(ctx)
  return useCallback(
    (hasActivity) => {
      toggleActivity(id, hasActivity)
    },
    [id],
  )
}
