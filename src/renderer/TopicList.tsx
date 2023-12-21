import { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { useTabManager, TAB_TYPES } from './TabManager'
import { TopicHierarchy } from './api/topics'

function TopicList({ topics }: { topics: TopicHierarchy[] }) {
  const [add] = useTabManager()

  return (
    <>
      <Box p={2} pb={0}>
        <Typography component="h2" variant="h5">
          Topics
        </Typography>
      </Box>
      <List component="nav">
        {topics.map((t) => (
          <Fragment key={t.name}>
            <ListItemButton onClick={() => add(t.name, TAB_TYPES.topic)}>
              <ListItemText primary={t.name} />
            </ListItemButton>
            {t.subscriptions.length > 0 && (
              <List>
                {t.subscriptions.map((s) => (
                  <ListItemButton
                    key={s.name}
                    sx={{ pl: 5 }}
                    onClick={() => add(s.name, TAB_TYPES.subscription)}
                  >
                    <ListItemText primary={s.name} />
                  </ListItemButton>
                ))}
              </List>
            )}
          </Fragment>
        ))}
      </List>
    </>
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
