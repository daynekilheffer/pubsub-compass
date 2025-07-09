import Search from '@mui/icons-material/Search'
import { Box, Divider, TextField } from '@mui/material'
import { useState } from 'react'
import { useTopics } from './PubSubDataAccess'
import RailList, { RailListItem } from './RailList'
import { useTabManager } from './TabManager'
import { createPinManager } from './TopicListManager'
import { Topic } from './api/topics'

const useTopicPins = createPinManager('topics')
function TopicList() {
  const topics = useTopics()
  const [setTab] = useTabManager()
  const [searchTerm, setSearchTerm] = useState('')

  const [pinnedTopics, togglePinned] = useTopicPins()

  const { pinned, unpinned } = topics.reduce<{ pinned?: Topic[]; unpinned?: Topic[] }>((acc, topic) => {
    if (pinnedTopics.includes(topic.name)) {
      acc.pinned ??= []
      acc.pinned.push(topic)
    } else if (topic.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      acc.unpinned ??= []
      acc.unpinned.push(topic)
    }
    return acc
  }, {})

  return (
    <RailList>
      {topics.length > 0 && (
        <Box p={2}>
          <TextField
            id="search-topics"
            label="Search"
            variant="outlined"
            type="search"
            size="small"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <Search />,
              },
            }}
          />
        </Box>
      )}
      {pinned?.map((t) => (
        <RailListItem
          key={t.name}
          name={t.name}
          pinned
          onSelect={() => setTab(t.name, 'topic')}
          onPinToggle={() => togglePinned(t.name)}
        />
      ))}
      {(pinned?.length ?? 0) > 0 && <Divider variant="middle" />}
      {unpinned?.map((t) => (
        <RailListItem
          key={t.name}
          name={t.name}
          onSelect={() => setTab(t.name, 'topic')}
          onPinToggle={() => togglePinned(t.name)}
        />
      ))}
    </RailList>
  )
}

export default TopicList
