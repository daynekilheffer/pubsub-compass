import {
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { HistoryItem } from '../api'

export default function TopicHistoryDrawer({
  open,
  onClose,
  history,
  onClearHistory,
  onLoadHistoryItem,
}: { open: boolean; onClose: () => void; history: HistoryItem[]; onClearHistory: () => void; onLoadHistoryItem: (h: HistoryItem) => void }) {
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
          <ListItemButton
            key={h.id}
            dense
            onClick={() => onLoadHistoryItem(h)}
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
          </ListItemButton>
        ))}
      </List>
      {history.length > 0 && (
        <Button onClick={onClearHistory}>clear history</Button>
      )}
    </Drawer>
  )
}
