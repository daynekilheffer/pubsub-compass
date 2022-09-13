import {
  Box,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { watch } from './api/subscriptions'
import { useTabActivityIndicator } from './TabManager'

export default function Pane({ tab, active = false }) {
  const [watching, setWatching] = useState(false)
  const [messages, setMessages] = useState([])
  const toggleActivity = useTabActivityIndicator(tab.name)

  useEffect(() => {
    if (watching) {
      const listener = (msg) => {
        setMessages((msgs) => [
          {
            id: msg.id,
            data: JSON.parse(msg.data),
            published: msg.published,
            attrs: msg.attrs,
          },
          ...msgs,
        ])
        toggleActivity(true)
      }
      return watch(tab.name, listener)
    }
  }, [watching, toggleActivity])

  useEffect(() => {
    if (active) {
      toggleActivity(false)
    }
  }, [active])

  if (!active) {
    return null
  }

  let table = <Typography>no data</Typography>
  if (messages.length > 0) {
    const cols = Object.keys(messages[0].data)

    table = (
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
                <TableCell key={col}>{JSON.stringify(msg.data[col])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <Box>
      <Button onClick={() => setWatching((val) => !val)}>
        {watching ? 'Stop watching' : 'Watch subscription'}
      </Button>
      {watching && <LinearProgress />}
      {table}
    </Box>
  )
}
Pane.propTypes = {
  tab: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool,
}
