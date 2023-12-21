import Pane from './Pane'
import { useTabs } from '../TabManager'
import EmptyPane from './EmptyPane'

export default function Panes() {
  const tabs = useTabs()
  if (tabs.length === 0) {
    return <EmptyPane />
  }
  return <>
    {tabs.map((tab) => (
      <Pane key={tab.id} tab={tab} active={tab.isSelected} />
    ))}
  </>
}
