
export type HistoryItem = {
  id: string
  payload: any
  attrs: { key: string, value: string }[]
}


export type TabType = 'sub' | 'topic'

export type TabData = {
  id: string
  name: string
  type: TabType
  activity?: boolean
  selected?: boolean
}
