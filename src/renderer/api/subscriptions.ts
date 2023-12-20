import { receivedMessage } from "src/ipc-api"

type messageListener = (message: receivedMessage) => void

let hasSubbed = false
const subMsgCallbacks: Record<string, messageListener> = {}

window.electronAPI.on.subscribedMessage((evt, msg) => {
  const listener = subMsgCallbacks[msg.sub]
  listener?.(msg)
})

export const watch = (subName: string, listener: (message: receivedMessage) => void) => {
  window.electronAPI.invoke.startWatch(subName)
  subMsgCallbacks[subName] = listener
  return () => {
    delete subMsgCallbacks[subName]
    window.electronAPI.invoke.stopWatch(subName)
  }
}

export const reset = () => window.electronAPI.invoke.resetSubscriptions()
