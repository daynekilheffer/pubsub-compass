import React, {
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { TabState, TabType } from './api';

type ContextValue = {
  activeTab: TabState | null;
  setTab: (name: string, type: TabType) => void;
}
const ctx = React.createContext<ContextValue>(null!)


export const TAB_TYPES = {
  subscription: 'sub',
  topic: 'topic',
} as const

export default function TabManager({ children }: { children: React.ReactNode }) {
  const [activeTab, setTabState] = useState<TabState>()

  const setTab = useCallback((name: string, type: TabType) => {
    setTabState({
      id: `${type}-${name}`,
      name,
      type,
      isSelected: true,
    })
  }, [])

  const value = useMemo(
    () => ({
      activeTab: activeTab || null,
      setTab,
    }),
    [activeTab, setTab],
  )
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const useTabManager = () => {
  const c = useContext(ctx)
  const setTab = useCallback((name: string, type: TabType) => c.setTab(name, type), [c])
  return [setTab] as const
}

export const useActiveTab = () => {
  const c = useContext(ctx)
  if (c === null) {
    throw new Error('useActiveTab called outside of TabManager')
  }
  return c.activeTab
}
