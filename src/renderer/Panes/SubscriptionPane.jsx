import {
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
import { watch } from '../api/subscriptions'
import { useTabActivityIndicator } from '../TabManager'
import BasePane from './BasePane'

export default function SubscriptionPane({ tab, active = false }) {
  const [watching, setWatching] = useState(false)
  const [messages, setMessages] = useState([])
  const toggleActivity = useTabActivityIndicator(tab.id)

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
        // this stops and restarts the watcher a lot as we jump tabs, would rather it didn't :thinking:
        if (!active) {
          toggleActivity(true)
        }
      }
      return watch(tab.name, listener)
    }
  }, [active, watching, toggleActivity])

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
    <BasePane>
      <Button onClick={() => setWatching((val) => !val)}>
        {watching ? 'Stop watching' : 'Watch subscription'}
      </Button>
      {watching && <LinearProgress />}
      {table}
    </BasePane>
  )
}
SubscriptionPane.propTypes = {
  tab: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool,
}
