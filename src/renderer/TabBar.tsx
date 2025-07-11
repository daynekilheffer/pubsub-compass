import React from 'react'
import { Badge, Box, Tab, Tabs, IconButton, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTabManager, useActiveTab, useTabs } from './TabManager'

const TabBar: React.FC = () => {
  const tabs = useTabs()
  const activeTab = useActiveTab()
  const { setActiveTab, closeTab } = useTabManager()

  if (tabs.length === 0) {
    return null
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue)
  }

  const handleCloseTab = (event: React.MouseEvent, tabId: string) => {
    event.stopPropagation()
    closeTab(tabId)
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
      <Tabs value={activeTab?.id || false} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Box display="flex" alignItems="baseline" gap={1}>
                <Chip
                  size="small"
                  label={tab.type === 'topic' ? 'T' : 'S'}
                  color="secondary"
                  variant="outlined"
                  sx={{ height: 22, minWidth: 22 }}
                />
                <Badge color="warning" variant="dot" invisible={!tab.hasActivity}>
                  {tab.name}
                </Badge>
              </Box>
            }
            icon={
              <IconButton
                component="span"
                size="small"
                onClick={(e) => handleCloseTab(e, tab.id)}
                sx={{
                  ml: 0.25,
                }}
              >
                <CloseIcon />
              </IconButton>
            }
            iconPosition="end"
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabBar
