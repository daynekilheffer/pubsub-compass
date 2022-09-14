import React, { useCallback, useState } from 'react'
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
import { send as topicSend } from '../api/topics'
import BasePane from './BasePane'

export default function TopicPane({ tab, active }) {
  const [text, setText] = useState('{}')
  const [attrs, setAttributes] = useState([])
  const [error, setError] = useState(null)

  const send = useCallback(
    (payload) => {
      topicSend(
        tab.name,
        payload,
        attrs.reduce(
          (result, attr) => ({
            ...result,
            [attr.key]: attr.value,
          }),
          {},
        ),
      )
    },
    [tab.name],
  )

  const submit = (e) => {
    setError(null)
    e.preventDefault()
    let json
    try {
      json = JSON.parse(text)
      send(json)
    } catch (err) {
      setError(err)
    }
  }

  const format = () => {
    try {
      const json = JSON.parse(text)
      const formatted = JSON.stringify(json, null, 2)
      setText(formatted)
    } catch (e) {
      setError(e)
    }
  }

  const onAddAttribute = () => setAttributes([...attrs, { key: '', value: '' }])

  const onAttributeChange = (idx) => (key, value) =>
    setAttributes(
      produce((draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[idx] = { key, value }
      }),
    )
  const onDeleteAttribute = (idx) => () =>
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
    <BasePane pt={3}>
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
            <Box textAlign="right" mt={2}>
              <Button onClick={format}>Format</Button>
              <Button type="submit">Send</Button>
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
    </BasePane>
  )
}
TopicPane.propTypes = {
  tab: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool,
}

function Attribute({ attrKey, value, onChange, onDelete }) {
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
