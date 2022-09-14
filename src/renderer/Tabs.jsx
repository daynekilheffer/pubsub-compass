import { Box, Tab, Tabs as MuiTabs } from '@mui/material'
import React from 'react'
import { useSelectedTab, useTabs } from './TabManager'

export default function Tabs() {
  const tabs = useTabs()
  const [, setSelected] = useSelectedTab()
  if (tabs.length === 0) {
    return null
  }

  return (
    <MuiTabs
      textColor="secondary"
      indicatorColor="secondary"
      value={tabs.findIndex((t) => t.selected)}
      onChange={(evt, val) => setSelected(tabs[val].id)}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          label={
            <Box>
              {tab.name}
              {tab.activity && (
                <Box
                  display="inline-block"
                  borderRadius="50%"
                  backgroundColor="info.light"
                  p={0.5}
                  ml={0.2}
                />
              )}
            </Box>
          }
        />
      ))}
    </MuiTabs>
  )
}
