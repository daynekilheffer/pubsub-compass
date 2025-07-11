import React, { useCallback, useContext, useMemo, useState } from 'react'
import { TabState, TabType } from './api'

type ContextValue = {
  tabs: TabState[]
  activeTab: TabState | null
  setTab: (name: string, type: TabType) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  setTabActivity: (id: string, hasActivity: boolean) => void
}
const ctx = React.createContext<ContextValue>(null!)

export const TAB_TYPES = {
  subscription: 'sub',
  topic: 'topic',
} as const

export default function TabManager({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<TabState[]>([])
  const [activeTabId, setActiveTabId] = useState<string | null>(null)

  const setTab = useCallback((name: string, type: TabType) => {
    const tabId = `${type}-${name}`

    setTabs((currentTabs) => {
      const existingTab = currentTabs.find((tab) => tab.id === tabId)
      if (existingTab) {
        // Tab already exists, just activate it
        return currentTabs
      }

      // Create new tab
      const newTab: TabState = {
        id: tabId,
        name,
        type,
        isSelected: false,
      }
      return [...currentTabs, newTab]
    })

    setActiveTabId(tabId)
  }, [])

  const closeTab = useCallback(
    (id: string) => {
      setTabs((currentTabs) => {
        const newTabs = currentTabs.filter((tab) => tab.id !== id)
        return newTabs
      })

      setActiveTabId((currentActiveId) => {
        if (currentActiveId === id) {
          // If we're closing the active tab, activate the last remaining tab
          const remainingTabs = tabs.filter((tab) => tab.id !== id)
          return remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null
        }
        return currentActiveId
      })
    },
    [tabs],
  )

  const setActiveTabFn = useCallback((id: string) => {
    setActiveTabId(id)
  }, [])

  const setTabActivity = useCallback((id: string, hasActivity: boolean) => {
    setTabs((currentTabs) => currentTabs.map((tab) => (tab.id === id ? { ...tab, hasActivity } : tab)))
  }, [])

  const activeTab = useMemo(() => {
    return tabs.find((tab) => tab.id === activeTabId) || null
  }, [tabs, activeTabId])

  const value = useMemo(
    () => ({
      tabs,
      activeTab,
      setTab,
      closeTab,
      setActiveTab: setActiveTabFn,
      setTabActivity,
    }),
    [tabs, activeTab, setTab, closeTab, setActiveTabFn, setTabActivity],
  )
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const useTabManager = () => {
  const c = useContext(ctx)
  const setTab = useCallback((name: string, type: TabType) => c.setTab(name, type), [c])
  const closeTab = useCallback((id: string) => c.closeTab(id), [c])
  const setActiveTab = useCallback((id: string) => c.setActiveTab(id), [c])
  const setTabActivity = useCallback((id: string, hasActivity: boolean) => c.setTabActivity(id, hasActivity), [c])
  return { setTab, closeTab, setActiveTab, setTabActivity, tabs: c.tabs } as const
}

export const useActiveTab = () => {
  const c = useContext(ctx)
  if (c === null) {
    throw new Error('useActiveTab called outside of TabManager')
  }
  return c.activeTab
}

export const useTabs = () => {
  const c = useContext(ctx)
  if (c === null) {
    throw new Error('useTabs called outside of TabManager')
  }
  return c.tabs
}
