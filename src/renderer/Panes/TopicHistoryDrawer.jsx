import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

export default function TopicHistoryDrawer({
  open,
  onClose,
  history,
  onClearHistory,
  onLoadHistoryItem,
}) {
  return (
    <Drawer
      PaperProps={{
        sx: { width: '350px' },
      }}
      anchor="right"
      open={open}
      onClose={(evt, reason) => reason === 'backdropClick' && onClose()}
    >
      <List>
        {history.reverse().map((h) => (
          <ListItem
            key={h.id}
            dense
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                onClick={() => onLoadHistoryItem(h)}
              >
                <SearchIcon />
              </IconButton>
            }
          >
            <ListItemText
              secondary={
                h.attrs.length > 0
                  ? h.attrs.map((a) => `${a.key}=${a.value}`).join(' ')
                  : undefined
              }
            >
              {JSON.stringify(h.payload, null, 1)}
            </ListItemText>
          </ListItem>
        ))}
      </List>
      {history.length > 0 && (
        <Button onClick={onClearHistory}>clear history</Button>
      )}
    </Drawer>
  )
}
TopicHistoryDrawer.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({})),
}
