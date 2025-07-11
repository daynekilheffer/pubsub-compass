import React from 'react'
import { Box, Tab, Tabs, IconButton, Chip } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
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
      <Tabs
        value={activeTab?.id || false}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTab-root': {
            textTransform: 'none',
            minHeight: 48,
            fontSize: '0.875rem',
          },
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            value={tab.id}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  size="small"
                  label={tab.type === 'topic' ? 'T' : 'S'}
                  color={tab.type === 'topic' ? 'primary' : 'secondary'}
                  sx={{ fontSize: '0.6rem', height: 20, minWidth: 20 }}
                />
                <span>{tab.name}</span>
                {tab.hasActivity && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'warning.main',
                      ml: 0.5,
                    }}
                  />
                )}
                <IconButton
                  size="small"
                  onClick={(e) => handleCloseTab(e, tab.id)}
                  sx={{
                    ml: 0.5,
                    padding: 0.25,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            }
          />
        ))}
      </Tabs>
    </Box>
  )
}

export default TabBar
