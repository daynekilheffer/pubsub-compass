import { useActiveTab } from '../TabManager'
import EmptyPane from './EmptyPane'
import Pane from './Pane'

export default function Panes() {
  const activeTab = useActiveTab()
  if (activeTab === null) {
    return <EmptyPane />
  }
  return <Pane key={activeTab.id} tab={activeTab} active={activeTab.isSelected} />
}
