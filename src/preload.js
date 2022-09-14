// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge, ipcRenderer } from 'electron'

let hasSubbed = false
const callbacks = {}

contextBridge.exposeInMainWorld('electronAPI', {
  listTopics: () => ipcRenderer.invoke('list-topics'),
  sendToTopic: (name, payload, attrs) =>
    ipcRenderer.invoke('send-to-topic', name, payload, attrs),
  watchSubscription: (name) => ipcRenderer.invoke('watch', name),
  onSubscribedMessage: (name, cb) => {
    if (!hasSubbed) {
      ipcRenderer.on('subscribed-message', (evt, val) => {
        callbacks[name](val)
      })
      hasSubbed = true
    }
    callbacks[name] = cb
  },
  stopSubscriptionWatch: (name) => {
    delete callbacks[name]
    ipcRenderer.send('stop-watch', name)
  },
})
