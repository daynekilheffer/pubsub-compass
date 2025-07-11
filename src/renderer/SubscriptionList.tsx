import Search from '@mui/icons-material/Search'
import { Box, Divider, TextField } from '@mui/material'
import { useState } from 'react'
import { Subscription, useSubscriptions } from './PubSubDataAccess'
import RailList, { RailListItem } from './RailList'
import { useTabManager } from './TabManager'
import { createPinManager } from './TopicListManager'

const useSubscriptionPins = createPinManager('subscription')
function SubscriptionList() {
  const subs = useSubscriptions()
  const { setTab } = useTabManager()
  const [searchTerm, setSearchTerm] = useState('')

  const [pinnedSubs, togglePinned] = useSubscriptionPins()

  const { pinned, unpinned } = subs.reduce<{ pinned?: Subscription[]; unpinned?: Subscription[] }>((acc, sub) => {
    if (pinnedSubs.includes(sub.name)) {
      acc.pinned ??= []
      acc.pinned.push(sub)
    } else if (sub.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      acc.unpinned ??= []
      acc.unpinned.push(sub)
    }
    return acc
  }, {})

  return (
    <RailList>
      {subs.length > 0 && (
        <Box p={2}>
          <TextField
            id="search-subscriptions"
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
