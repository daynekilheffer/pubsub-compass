import React from 'react'
import PropTypes from 'prop-types'
import { TAB_TYPES } from '../TabManager'
import SubscriptionPane from './SubscriptionPane'
import TopicPane from './TopicPane'

export default function Pane({ tab, active = false }) {
  if (tab.type === TAB_TYPES.subscription) {
    return <SubscriptionPane tab={tab} active={active} />
  }
  if (tab.type === TAB_TYPES.topic) {
    return <TopicPane tab={tab} active={active} />
  }
  return null
}
Pane.propTypes = {
  tab: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }).isRequired,
  active: PropTypes.bool,
}
