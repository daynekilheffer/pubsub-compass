export type { Topic, TopicHierarchy } from "../../ipc-api"

export const list = () => window.electronAPI.invoke.listTopics()

export const send = (name: string, payload: string, attrs: Record<string, string>) =>
  window.electronAPI.invoke.sendOnTopic(name, payload, attrs)
