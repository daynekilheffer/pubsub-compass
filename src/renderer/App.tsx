import { useEffect, useState } from 'react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import { list, TopicHierarchy } from './api/topics'
import { reset } from './api/subscriptions'

import TopicList from './TopicList'
import Frame, { Rail, Main } from './Structure'
import TabManager from './TabManager'
import Tabs from './Tabs'
import Panes from './Panes'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1987cb',
    },
    secondary: {
      main: '#cb5d19',
      light: '#f2cb88',
    },
    background: {
      default: '#fbf3e2',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontSize: 12,
  },
})

function App() {
  const [topics, setTopics] = useState<TopicHierarchy[]>([])
  useEffect(() => {
    list().then((t) => setTopics(t))
  }, [])

  useEffect(() => {
    reset()
  }, [])

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <TabManager>
          <Frame>
            <Rail>
              <TopicList topics={topics} />
            </Rail>
            <Main>
              <Tabs />
              <Panes />
            </Main>
          </Frame>
        </TabManager>
      </ThemeProvider>
    </>
  )
}

export default App
