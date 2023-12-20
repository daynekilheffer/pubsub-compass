import React from 'react'
import Pane from './Pane'
import { useTabs } from '../TabManager'

export default function Panes() {
  const tabs = useTabs()
  return <>
    {tabs.map((tab) => (
      <Pane key={tab.id} tab={tab} active={tab.selected} />
    ))}
  </>
}
