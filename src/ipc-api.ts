import { PubSub } from "@google-cloud/pubsub";
import { GetApiType, contextBridge, createIpcRenderer } from "electron-typescript-ipc";

export type TopicHierarchy = {
  name: string,
  subscriptions: {
    id: string,
    name: string,
  }[]
}

export type receivedMessage = {
  sub: string,
  id: string,
  data: string,
  attrs: Record<string, string>,
  published: Date,
}

export type Api = GetApiType<
  {
    listTopics: () => Promise<TopicHierarchy[]>
    sendOnTopic: (name: string, payload: string, attrs: Record<string, string>) => Promise<void>
    resetSubscriptions: () => void
    storageGet: (key: string) => Promise<unknown>
    storageSet: (key: string, data: object) => Promise<void>
    stopWatch: (name: string) => void
    startWatch: (name: string) => void
    setActivity: (activity: boolean) => void
  },
  {
    subscribedMessage: (message: receivedMessage) => void
  }
>;
