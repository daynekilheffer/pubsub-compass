import { Divider } from '@mui/material'
import { Subscription, useSubscriptions } from './PubSubDataAccess'
import RailList, { RailListItem } from './RailList'
import { useTabManager } from './TabManager'
import { createPinManager } from './TopicListManager'

const useSubscriptionPins = createPinManager('subscription')
function SubscriptionList() {
  const subs = useSubscriptions()
  const [setTab] = useTabManager()

  const [pinnedSubs, togglePinned] = useSubscriptionPins()

  const { pinned, unpinned } = subs.reduce<{ pinned?: Subscription[]; unpinned?: Subscription[] }>((acc, sub) => {
    if (pinnedSubs.includes(sub.name)) {
      acc.pinned ??= []
      acc.pinned.push(sub)
    } else {
      acc.unpinned ??= []
      acc.unpinned.push(sub)
    }
    return acc
  }, {})

  return (
    <RailList>
      {pinned?.map((sub) => (
        <RailListItem
          key={sub.name}
          name={sub.name}
          pinned
          onSelect={() => setTab(sub.name, 'sub')}
          onPinToggle={() => togglePinned(sub.name)}
        />
      ))}
      {(pinned?.length ?? 0) > 0 && <Divider variant="middle" />}
      {unpinned?.map((sub) => (
        <RailListItem
          key={sub.name}
          name={sub.name}
          onSelect={() => setTab(sub.name, 'sub')}
          onPinToggle={() => togglePinned(sub.name)}
        />
      ))}
    </RailList>
  )
}

export default SubscriptionList
