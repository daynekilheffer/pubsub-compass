// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRendererEvent, contextBridge } from 'electron';
import { createIpcRenderer } from 'electron-typescript-ipc';
import { Api, receivedMessage } from './ipc-api';


const ipcRenderer = createIpcRenderer<Api>();

const api: Api = {
  invoke: {
    listTopics: async () => {
      return await ipcRenderer.invoke('listTopics');
    },
    sendOnTopic: async (...args) => {
      return ipcRenderer.invoke('sendOnTopic', ...args);
    },
    resetSubscriptions: async (...args) => {
      return ipcRenderer.invoke('resetSubscriptions', ...args);
    },
    storageGet: async (...args) => {
      return ipcRenderer.invoke('storageGet', ...args);
    },
    storageSet: async (...args) => {
      return ipcRenderer.invoke('storageSet', ...args);
    },
    startWatch: async (...args) => {
      return ipcRenderer.invoke('startWatch', ...args);
    },
    stopWatch: async (...args) => {
      return ipcRenderer.invoke('stopWatch', ...args);
    },
    setActivity: async (...args) => {
      return ipcRenderer.invoke('stopWatch', ...args);
    },
  },
  on: {
    subscribedMessage: (listener: (event: IpcRendererEvent, message: receivedMessage) => void) => {
      ipcRenderer.on('subscribedMessage', (evt, msg) => {
        // @ts-expect-error
        listener(evt, msg);
      })
    }
  },
};

contextBridge.exposeInMainWorld('electronAPI', api);

declare global {
  interface Window {
    electronAPI: Api;
  }
}
