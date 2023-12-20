import React, { ComponentProps } from 'react'
import { Box, IconButton, Tab, Tabs as MuiTabs } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useSelectTab, useTabManager, useTabs } from './TabManager'

export default function Tabs() {
  const tabs = useTabs()
  const [, deleteTab] = useTabManager()
  const selectTab = useSelectTab()
  if (tabs.length === 0) {
    return null
  }

  let selectedIdx: number | false = tabs.findIndex((t) => t.selected === true)
  if (selectedIdx === -1) {
    selectedIdx = false
  }

  return (
    <MuiTabs
      textColor="secondary"
      indicatorColor="secondary"
      variant="scrollable"
      scrollButtons="auto"
      value={selectedIdx}
      onChange={(evt, val) => selectTab(tabs[val].id)}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          icon={
            <IconButton
              component="span"
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                deleteTab(tab.id)
              }}
            >
              <CloseIcon />
            </IconButton>
          }
          iconPosition="end"
          label={
            <Box>
              {tab.name}
              {tab.activity && (
                <Box
                  display="inline-block"
                  borderRadius="50%"
                  bgcolor="info.light"
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
