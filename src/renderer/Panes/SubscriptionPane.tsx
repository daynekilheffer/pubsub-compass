import Settings from '@mui/icons-material/Settings'
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  IconButton,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { TabState } from '../api'
import { receivedMessage, watch } from '../api/subscriptions'
import { useTabManager } from '../TabManager'
import BasePane from './BasePane'

const walk = (json: Record<string, unknown>, path: string): unknown => {
  const parts = path.split('.')
  const subJson = json[parts[0]]
  if (parts.length > 1) {
    if (typeof subJson !== 'object' || subJson === null || Array.isArray(subJson)) {
      return undefined
    }
    return walk(subJson as Record<string, unknown>, parts.slice(1).join('.'))
  }
  return subJson
}
const extractData = (msg: parsedMessage, accessor: string) => {
  if (accessor.startsWith('data: ')) {
    return walk(msg.data, accessor.substring(6))
  }
  if (accessor.startsWith('attr: ')) {
    return walk(msg.attrs, accessor.substring(6))
  }
}

const extractNested = (obj: object) => {
  let output: unknown[] = []
  Object.entries(obj).forEach(([key, val]) => {
    if (typeof val === 'object' && !Array.isArray(val)) {
      output = [...output, ...extractNested(val).map((p) => `${key}.${p}`)]
    }
    output.push(key)
  })
  return output
}
const extractPaths = (obj: parsedMessage) => [
  ...extractNested(obj.data).map((p) => `data: ${p}`),
  ...extractNested(obj.attrs).map((p) => `attr: ${p}`),
]

type parsedMessage = {
  id: string
  data: Record<string, unknown>
  published: Date
  attrs: Record<string, string>
}

type Settings = {
  fields: string[]
  editFields: string[]
}

export default function SubscriptionPane({ tab, active = false }: { tab: TabState; active?: boolean }) {
  const [watching, setWatching] = useState(false)
  const [messages, setMessages] = useState<parsedMessage[]>([])
  const [settings, setSettings] = useState<Settings>({ fields: [], editFields: [] })
  const [editingSettings, setEditingSettings] = useState(false)
  const { setTabActivity } = useTabManager()

  useEffect(() => {
    if (watching) {
      const listener = (msg: receivedMessage) => {
        setMessages((msgs) => [
          {
            id: msg.id,
            data: JSON.parse(msg.data),
            published: new Date(msg.published),
            attrs: msg.attrs,
          },
          ...msgs,
        ])
        // Set activity indicator if the tab is not currently active
        if (!active) {
          setTabActivity(tab.id, true)
        }
      }
      return watch(tab.name, listener)
    }
  }, [tab.name, tab.id, active, watching, setTabActivity])

  useEffect(() => {
    if (active) {
      // Clear activity indicator when tab becomes active
      setTabActivity(tab.id, false)
    }
  }, [active, tab.id, setTabActivity])

  useEffect(() => {
    const to = setTimeout(() => {
      setSettings((set) => ({
        ...set,
        fields: set.editFields,
      }))
    }, 500)
    return () => clearTimeout(to)
  }, [settings.editFields])

  if (!active) {
    return null
  }

  let cols: string[] = []
  let suggestedValues: string[] = []
  if (messages.length > 0) {
    cols = [
      ...Object.keys(messages[0].data).map((d) => `data: ${d}`),
      ...Object.keys(messages[0].attrs).map((a) => `attr: ${a}`),
    ]

    if (editingSettings) {
      suggestedValues = extractPaths(messages[0])
    }
  }
  if (settings.fields.length > 0) {
    cols = settings.fields
  }

  const table = (
    <>
      <Typography component="p" gutterBottom>
        Messages
      </Typography>
      <Box width="100%" overflow="scroll">
        <Table>
          <TableHead>
            <TableRow>
              {cols.map((col) => (
                <TableCell key={col}>{col}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                {cols.map((col) => (
                  <TableCell key={col}>{JSON.stringify(extractData(msg, col))}</TableCell>
                ))}
              </TableRow>
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell>
                  <Typography variant="body2">no data</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
  )

  return (
    <BasePane>
      <Typography variant="h6" paragraph>
        {tab.name}
      </Typography>
      <Box mb={2}>
        <Box display="flex" justifyContent="space-between">
          <Button onClick={() => setWatching((val) => !val)}>
            {watching ? 'Stop watching' : 'Watch subscription'}
          </Button>
          <Box>
            <IconButton
              onClick={() => {
                setSettings({ ...settings, editFields: settings.fields })
                setEditingSettings((v) => !v)
              }}
            >
              <Settings />
            </IconButton>
          </Box>
        </Box>
        <Collapse in={editingSettings}>
          {settings.editFields.map((field, idx) => (
            <SettingsField
              value={field}
              allowedValues={suggestedValues}
              onChange={(value) => {
                setSettings((existingSettings) => {
                  const settings = {
                    ...existingSettings,
                    editFields: [...existingSettings.editFields],
                  }
                  settings.editFields[idx] = value
                  return settings
                })
              }}
            />
          ))}
          <Button
            onClick={() =>
              setSettings((s) => ({
                ...s,
                editFields: [...s.editFields, ''],
              }))
            }
          >
            Add
          </Button>
        </Collapse>
        {watching && <LinearProgress />}
      </Box>

      {table}
    </BasePane>
  )
}

const SettingsField = ({
  value,
  allowedValues,
  onChange,
}: {
  value: string
  allowedValues: string[]
  onChange: (msg: string) => void
}) => {
  return (
    <Box mb={1}>
      <Autocomplete
        renderInput={(params) => <TextField {...params} label="path" />}
        size="small"
        sx={{
          maxWidth: '500px',
        }}
        options={allowedValues}
        freeSolo
        value={value}
        onChange={(evt, val, reason) => {
          if (reason === 'createOption' || reason === 'selectOption') {
            onChange(val ?? '')
          }
          if (reason === 'clear') {
            onChange('')
          }
        }}
      />
    </Box>
  )
}
