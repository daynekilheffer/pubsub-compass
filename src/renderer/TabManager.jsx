import React, { useCallback, useContext, useMemo, useState } from 'react'

const ctx = React.createContext(null)

// TODO switch all "byName" functions to "byId"

export const TAB_TYPES = {
  subscription: 'sub',
  topic: 'topic',
}

export default function TabManager({ children }) {
  const [tabs, setTabs] = useState([])

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
  })

  const value = useMemo(() => ({
    tabs,
    addTab,
    selectTab,
    toggleActivity,
  }))
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const useTabManager = () => {
  const c = useContext(ctx)
  const add = useCallback((name, type) => c.addTab(name, type), [])
  return [add]
}

export const useTabs = () => {
  const c = useContext(ctx)
  return c.tabs
}

export const useSelectedTab = () => {
  const c = useContext(ctx)
  const tabs = useTabs()
  const select = useCallback((id) => c.selectTab(id), [])
  return [tabs.find((t) => t.selected), select]
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
