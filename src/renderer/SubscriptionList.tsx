import { PushPin } from '@mui/icons-material'
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { Subscription, useSubscriptions } from './PubSubDataAccess'
import { useTabManager } from './TabManager'
import { createPinManager } from './TopicListManager'

const useSubscriptionPins = createPinManager('subscription')
function SubscriptionList() {
  const subs = useSubscriptions()
  const [setTab] = useTabManager()


  const [pinnedSubs, togglePinned] = useSubscriptionPins()

  const renderSub = (sub: Subscription) => {
    return (
      <ListItem key={sub.name} disablePadding secondaryAction={<IconButton onClick={() => togglePinned(sub.name)}><PushPin /></IconButton>}>
        <ListItemButton
          onClick={() => {
            setTab(sub.name, 'sub')
          }}>
          <ListItemText primary={sub.name} />
        </ListItemButton>
      </ListItem>
    )
  }

  const { pinned, unpinned } = subs.reduce<{ pinned?: Subscription[], unpinned?: Subscription[] }>((acc, sub) => {
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
    <>
      {pinned?.length ?
        <List component="nav">
          {pinned.map(s => renderSub(s))}
        </List> : null
      }
      {unpinned?.length ?
        <List component="nav">
          {unpinned.map(s => renderSub(s))}
        </List> : null
      }
    </>
  )
}

export default SubscriptionList
