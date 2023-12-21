import React, { useCallback, useState, useEffect, FormEventHandler, useRef } from 'react'
import PropTypes from 'prop-types'

import { produce } from 'immer'

import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import HistoryIcon from '@mui/icons-material/History'
import { send as topicSend } from '../api/topics'
import BasePane from './BasePane'
import TopicHistory from './TopicHistoryDrawer'

import { create as storageFactory } from '../api/storage'
import { HistoryItem, TabState } from '../api'
import { z } from 'zod'

const history = z.object({
  id: z.string(),
  payload: z.string(),
  attrs: z.array(
    z.object(
      { key: z.string(), value: z.string() }
    )
  ),
})

const createStorage = (tabName: string) => {
  return storageFactory(history, tabName)
}

const useHistoryStorage = (tabName: string) => {
  const historyStorage = useRef<ReturnType<typeof createStorage>>()
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

  const addItem = (payload: HistoryItem["payload"], attrs: HistoryItem["attrs"]) => {
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

  return [state, addItem, deleteItem, clearHistory] as const
}

export default function TopicPane({ tab, active }: { tab: TabState; active: boolean }) {
  const [history, addToHistory, , clearHistory] = useTabHistory(tab.name)
  const [text, setText] = useState('{}')
  const [attrs, setAttributes] = useState<{ key: string, value: string }[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  const send = useCallback(
    (payload: any) => {
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
    [tab.name, addToHistory],
  )

  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    setError(null)
    e.preventDefault()
    let json
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
    setAttributes(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[idx] = { key, value }
      }),
    )
  const onDeleteAttribute = (idx: number) => () =>
    setAttributes(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft.splice(idx, 1)
      }),
    )

  if (!active) {
    return null
  }
  return (
    <BasePane>
      <form onSubmit={submit}>
        <Box display="flex">
          <Box flexGrow={1} pr={2}>
            <Typography paragraph>Message</Typography>
            <TextField
              sx={{
                '& textarea': {
                  fontFamily: 'monospace',
                },
              }}
              name="payload"
              inputProps={{ fontFamily: 'monospace' }}
              label="json payload"
              minRows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              multiline
              fullWidth
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Box>
                <IconButton
                  size="small"
                  onClick={() => setHistoryOpen(true)}
                  disabled={history.length === 0}
                >
                  <HistoryIcon />
                </IconButton>
              </Box>
              <Box>
                <Button onClick={() => formatAndSave(text)}>Format</Button>
                <Button type="submit">Send</Button>
              </Box>
            </Box>
          </Box>
          <Box flexBasis="300px" p="0 8px 0 8px">
            <Typography paragraph>Attributes</Typography>
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
            <Button onClick={onAddAttribute}>Add</Button>
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
            setText(item.payload)
          }
          setAttributes(item.attrs)
          setHistoryOpen(false)
        }}
      />
    </BasePane>
  )
}

function Attribute({ attrKey = '', value = '', onChange, onDelete }: {
  attrKey?: string
  value?: string
  onChange: (key: string, value: string) => void
  onDelete: () => void
}) {
  return (
    <Box display="inline-flex" m="0 0 4px 0">
      <TextField
        label="key"
        value={attrKey}
        size="small"
        sx={{ mr: 0.5 }}
        onChange={(e) => onChange(e.target.value, value)}
      />
      <TextField
        label="value"
        value={value}
        size="small"
        onChange={(e) => onChange(attrKey, e.target.value)}
      />
      <IconButton
        aria-label="delete"
        size="small"
        sx={{ marginLeft: 1 }}
        onClick={onDelete}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  )
}
Attribute.propTypes = {
  attrKey: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}
