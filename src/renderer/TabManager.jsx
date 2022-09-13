import React, { useCallback, useContext, useMemo, useState } from 'react'

const ctx = React.createContext(null)

export default function TabManager({ children }) {
  const [tabs, setTabs] = useState([])

  const selectTab = useCallback((name) => {
    setTabs((state) =>
      state.map((tb) => ({
        ...tb,
        selected: tb.name === name,
      })),
    )
  }, [])
  const addTab = useCallback((name) => {
    setTabs((state) => {
      const newTabs = [...state]
      const tab = newTabs.find((t) => t.name === name)
      if (!tab) {
        newTabs.push({ name })
      }

      return newTabs.map((tb) => ({
        ...tb,
        selected: tb.name === name,
      }))
    })
  }, [])
  const toggleActivity = useCallback((name, hasActivity) => {
    setTabs((state) => {
      const newTabs = [...state]
      const tab = newTabs.find((t) => t.name === name)
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
  const add = useCallback((name) => c.addTab(name), [])
  return [add]
}

export const useTabs = () => {
  const c = useContext(ctx)
  return c.tabs
}

export const useSelectedTab = () => {
  const c = useContext(ctx)
  const tabs = useTabs()
  const select = useCallback((name) => c.selectTab(name), [])
  return [tabs.find((t) => t.selected === true), select]
}
export const useTabActivityIndicator = (name) => {
  const { toggleActivity } = useContext(ctx)
  return useCallback(
    (hasActivity) => {
      toggleActivity(name, hasActivity)
    },
    [name],
  )
}
