import { Divider } from '@mui/material'
import { useTopics } from './PubSubDataAccess'
import RailList, { RailListItem } from './RailList'
import { useTabManager } from './TabManager'
import { createPinManager } from './TopicListManager'
import { Topic } from './api/topics'

const useTopicPins = createPinManager('topics')
function TopicList() {
  const topics = useTopics()
  const [setTab] = useTabManager()

  const [pinnedTopics, togglePinned] = useTopicPins()

  const { pinned, unpinned } = topics.reduce<{ pinned?: Topic[]; unpinned?: Topic[] }>((acc, topic) => {
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
    <RailList>
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
