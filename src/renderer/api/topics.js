export const list = () => window.electronAPI.listTopics()

export const send = (name, payload, attrs) =>
  window.electronAPI.sendToTopic(name, payload, attrs)
