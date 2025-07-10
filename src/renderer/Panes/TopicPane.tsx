import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import HistoryIcon from '@mui/icons-material/History'
import AddIcon from '@mui/icons-material/Add'
import DataObjectIcon from '@mui/icons-material/DataObject'
import SendIcon from '@mui/icons-material/Send'
import { Box, Button, FormHelperText, IconButton, Stack, TextField, Typography } from '@mui/material'
import { send as topicSend } from '../api/topics'
import BasePane from './BasePane'
import TopicHistory from './TopicHistoryDrawer'

import { HistoryItem, HistoryItemSchema, Message, TabState } from '../api'
import { create as storageFactory } from '../api/storage'
import Editor from './Editor'

const createStorage = (tabName: string) => {
  return storageFactory(HistoryItemSchema, tabName)
}

const useHistoryStorage = (tabName: string) => {
  const historyStorage = useRef<ReturnType<typeof createStorage>>(undefined)
  if (!historyStorage.current) {
    historyStorage.current = createStorage(tabName)
  }
  return historyStorage.current
}

const useTabHistory = (tabName: string) => {
  const historyStorage = useHistoryStorage(`${tabName}-history.json`)
  const [state, setState] = useState<HistoryItem[]>([])
  useEffect(() => {
    historyStorage.getAll().then((hist) => {
      if (hist.length > 0) {
        setState(hist)
      }
    })
  }, [historyStorage])

  const addItem = (payload: HistoryItem['payload'], attrs: HistoryItem['attrs']) => {
    const id = `history-${Math.floor(Math.random() * 1000000)}`
    const newItem = { id, payload, attrs }
    const newState = [...state, newItem]
    setState(newState)
    historyStorage.setAll(newState)
  }
  const deleteItem = (idx: number) => {
    const newState = state.slice(idx, idx + 1)
    setState(newState)
    historyStorage.setAll(newState)
  }
  const clearHistory = () => {
    setState([])
    historyStorage.setAll([])
  }

  return { history: state, add: addItem, delete: deleteItem, clear: clearHistory }
}

export default function TopicPane({ tab, active }: { tab: TabState; active: boolean }) {
  const { history, add: addToHistory, clear: clearHistory } = useTabHistory(tab.name)
  const [text, setText] = useState('{}')
  const [attrs, setAttributes] = useState<{ key: string; value: string }[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  const send = useCallback(
    (payload: Message) => {
      topicSend(
        tab.name,
        payload,
        attrs.reduce<Record<string, string>>(
          (result, attr) => ({
            ...result,
            [attr.key]: attr.value,
          }),
          {},
        ),
      )
      addToHistory(payload, attrs)
    },
    [tab.name, addToHistory, attrs],
  )

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    setError(null)
    e.preventDefault()
    let json: object
    try {
      json = JSON.parse(text)
      send(json)
    } catch (err) {
      setError(err as Error)
    }
  }

  const formatAndSave = (rawText: string) => {
    try {
      const json = JSON.parse(rawText)
      const formatted = JSON.stringify(json, null, 2)
      setText(formatted)
      return true
    } catch (e) {
      setError(e as Error)
      return false
    }
  }

  const onAddAttribute = () => setAttributes([...attrs, { key: '', value: '' }])

  const onAttributeChange = (idx: number) => (key: string, value: string) =>
    setAttributes((attrs) => {
      const newAttrs = [...attrs]
      newAttrs[idx] = { key, value }
      return newAttrs
    })
  const onDeleteAttribute = (idx: number) => () =>
    setAttributes((attrs) => {
      const newAttrs = [...attrs]
      newAttrs.splice(idx, 1)
      return newAttrs
    })

  if (!active) {
    return null
  }
  return (
    <BasePane>
      <form onSubmit={submit}>
        <Box display="flex">
          <Box flexGrow={1} pr={2}>
            <Typography component="p" gutterBottom>
              Message
            </Typography>
            <Editor value={text} onChange={(v) => setText(v)} />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Box>
                <Button
                  color="primary"
                  onClick={() => setHistoryOpen(true)}
                  disabled={history.length === 0}
                  startIcon={<HistoryIcon />}
                >
                  History
                </Button>
              </Box>
              <Stack direction="row" spacing={1}>
                <Button onClick={() => formatAndSave(text)} startIcon={<DataObjectIcon />}>
                  Format
                </Button>
                <Button type="submit" startIcon={<SendIcon />}>
                  Send
                </Button>
              </Stack>
            </Box>
          </Box>
          <Box flexBasis="300px" p="0 8px 0 8px">
            <Typography component="p" gutterBottom>
              Attributes
            </Typography>
            {attrs.map((attr, idx) => (
              <Box display="flex" alignContent="space-between">
                <Attribute
                  attrKey={attr.key}
                  value={attr.value}
                  onChange={onAttributeChange(idx)}
                  onDelete={onDeleteAttribute(idx)}
                />
              </Box>
            ))}
            <Button onClick={onAddAttribute} startIcon={<AddIcon />}>
              Add
            </Button>
          </Box>
        </Box>
        {error && <FormHelperText error>{error.message}</FormHelperText>}
      </form>
      <TopicHistory
        open={historyOpen}
        history={history}
        onClose={() => setHistoryOpen(false)}
        onClearHistory={() => clearHistory()}
        onLoadHistoryItem={(item) => {
          if (!formatAndSave(JSON.stringify(item.payload))) {
            setText(JSON.stringify(item.payload))
          }
          setAttributes(item.attrs)
          setHistoryOpen(false)
        }}
      />
    </BasePane>
  )
}

function Attribute({
  attrKey = '',
  value = '',
  onChange,
  onDelete,
}: {
  attrKey?: string
  value?: string
  onChange: (key: string, value: string) => void
  onDelete: () => void
}) {
  return (
    <Box display="inline-flex" alignItems="center" m="0 0 4px 0">
      <TextField
        label="key"
        value={attrKey}
        size="small"
        sx={{ mr: 0.5 }}
        onChange={(e) => onChange(e.target.value, value)}
      />
      <TextField label="value" value={value} size="small" onChange={(e) => onChange(attrKey, e.target.value)} />
      <IconButton aria-label="delete" color="error" size="small" sx={{ marginLeft: 1 }} onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
  )
}
