import React, { useEffect, useState } from 'react'
import { CssBaseline } from '@mui/material'

import { list } from './api/topics'

import TopicList from './TopicList'
import Frame, { Rail, Main } from './Structure'
import TabManager from './TabManager'
import Tabs from './Tabs'

function App() {
  const [topics, setTopics] = useState([])
  useEffect(() => {
    list().then((t) => setTopics(t))
  }, [])

  return (
    <>
      <CssBaseline />
      <TabManager>
        <Frame>
          <Rail>
            <TopicList topics={topics} />
          </Rail>
          <Main>
            <Tabs />
          </Main>
        </Frame>
      </TabManager>
    </>
  )
}

export default App
