export const watch = (subName, listener) => {
  window.electronAPI.watchSubscription(subName)
  window.electronAPI.onSubscribedMessage(subName, (msg) => {
    if (msg.sub === subName) {
      listener(msg)
    }
  })
  return () => window.electronAPI.stopSubscriptionWatch(subName)
}

export const reset = () => window.electronAPI.resetSubscriptions()
