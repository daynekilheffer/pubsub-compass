import { PushPin } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { ReactNode } from 'react'

const RailList = ({ children }: { children: ReactNode }) => {
  return (
    <List component="nav" disablePadding>
      {children}
    </List>
  )
}

export const RailListItem = ({
  name,
  pinned = false,
  onSelect,
  onPinToggle,
}: {
  name: string
  pinned?: boolean
  onSelect: () => void
  onPinToggle: () => void
}) => {
  return (
    <ListItem
      key={name}
      disablePadding
      secondaryAction={
        <IconButton size="small" onClick={onPinToggle}>
          <PushPin color={pinned ? 'primary' : 'inherit'} />
        </IconButton>
      }
    >
      <ListItemButton onClick={onSelect}>
        <ListItemText primary={name} />
      </ListItemButton>
    </ListItem>
  )
}

export default RailList
