import { PushPin } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader
} from '@mui/material'
import { useTopics } from './PubSubDataAccess'
import { useTabManager } from './TabManager'
import { createPinManager } from './TopicListManager'
import { Topic } from './api/topics'

const useTopicPins = createPinManager('topics')
function TopicList() {
  const topics = useTopics()
  const [setTab] = useTabManager()

  const [pinnedTopics, togglePinned] = useTopicPins()

  const renderTopic = (topic: Topic) => {
    return (
      <ListItem key={topic.name} disablePadding secondaryAction={<IconButton onClick={() => togglePinned(topic.name)}><PushPin /></IconButton>}>
        <ListItemButton
          onClick={() => {
            setTab(topic.name, 'topic')
          }}>
          <ListItemText primary={topic.name} />
        </ListItemButton>
      </ListItem>
    )
  }

  const { pinned, unpinned } = topics.reduce<{ pinned?: Topic[], unpinned?: Topic[] }>((acc, topic) => {
    if (pinnedTopics.includes(topic.name)) {
      acc.pinned ??= []
      acc.pinned.push(topic)
    } else {
      acc.unpinned ??= []
      acc.unpinned.push(topic)
    }
    return acc
  }, {})

  return (
    <>
      {pinned?.length ?
        <List component="nav" disablePadding>
          <ListSubheader>Pinned</ListSubheader>
          {pinned.map(t => renderTopic(t))}
        </List> : null
      }
      {unpinned?.length ?
        <List component="nav" disablePadding>
          {(pinned?.length ?? 0) > 0 && <ListSubheader>Unpinned</ListSubheader>}
          {unpinned.map(t => renderTopic(t))}
        </List> : null
      }
    </>
  )
}

export default TopicList
