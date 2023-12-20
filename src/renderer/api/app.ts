export const setActivity = (activity: boolean) => {
  window.electronAPI.invoke.setActivity(activity)
}
