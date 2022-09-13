import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { useTabManager } from './TabManager'

function TopicList({ topics }) {
  const [add] = useTabManager()
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Topics
        </ListSubheader>
      }
    >
      {topics.map((t) => (
        <Fragment key={t.name}>
          <ListItemButton>
            <ListItemText primary={t.name} />
          </ListItemButton>
          {t.subscriptions.length > 0 && (
            <List>
              {t.subscriptions.map((s) => (
                <ListItemButton
                  key={s.name}
                  sx={{ pl: 5 }}
                  onClick={() => add(s.name)}
                >
                  <ListItemText primary={s.name} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Fragment>
      ))}
    </List>
  )
}
TopicList.propTypes = {
  topics: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default TopicList
