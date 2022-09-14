export const list = () => window.electronAPI.listTopics()

export const send = (name, payload) =>
  window.electronAPI.sendToTopic(name, payload)
