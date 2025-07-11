import { useActiveTab, useTabs } from '../TabManager'
import EmptyPane from './EmptyPane'
import Pane from './Pane'
import TabBar from '../TabBar'
import { Box } from '@mui/material'

export default function Panes() {
  const tabs = useTabs()
  const activeTab = useActiveTab()

  if (tabs.length === 0) {
    return <EmptyPane />
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TabBar />
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {tabs.map((tab) => (
          <Box
            key={tab.id}
            sx={{
              height: '100%',
              display: tab.id === activeTab?.id ? 'block' : 'none',
            }}
          >
            <Pane tab={tab} active={tab.id === activeTab?.id} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
