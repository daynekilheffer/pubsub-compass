import { TabData } from '../TabManager'
import SubscriptionPane from './SubscriptionPane'
import TopicPane from './TopicPane'

export default function Pane({ tab, active = false }: { tab: TabData, active?: boolean }) {
  if (tab.type === 'sub') {
    return <SubscriptionPane tab={tab} active={active} />
  }
  if (tab.type === 'topic') {
    return <TopicPane tab={tab} active={active} />
  }
  return null
}
