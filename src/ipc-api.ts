import { GetApiType } from 'electron-typescript-ipc'
import { z } from 'zod'

export type Topic = {
  name: string
}
export type TopicHierarchy = Topic & {
  subscriptions: {
    id: string
    name: string
  }[]
}

export const ReceivedMessageSchema = z.object({
  sub: z.string(),
  id: z.string(),
  data: z.string(),
  attrs: z.record(z.string()),
  published: z.string(),
})

export type receivedMessage = z.infer<typeof ReceivedMessageSchema>

export type Api = GetApiType<
  {
    listTopics: () => Promise<TopicHierarchy[]>
    sendOnTopic: (name: string, payload: object, attrs: Record<string, string>) => Promise<void>
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
>
