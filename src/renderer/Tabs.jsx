import { Tab, Tabs as MuiTabs } from '@mui/material'
import React, { useState } from 'react'
import Pane from './Pane'
import { useSelectedTab, useTabs } from './TabManager'

export default function Tabs() {
  const tabs = useTabs()
  const [selectedTab, setSelected] = useSelectedTab()
  if (tabs.length === 0) {
    return null
  }

  return (
    <>
      <MuiTabs
        value={tabs.findIndex((t) => t.name === selectedTab?.name)}
        onChange={(evt, val) => setSelected(tabs[val].name)}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            icon={tab.activity ? 'act' : undefined}
            label={tab.name}
          />
        ))}
      </MuiTabs>
      {tabs.map((tab) => (
        <Pane
          key={tab.name}
          tab={tab}
          active={tab.name === selectedTab?.name}
        />
      ))}
    </>
  )
}
