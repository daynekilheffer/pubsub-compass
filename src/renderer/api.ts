import { z } from 'zod'

export const HistoryItemSchema = z.object({
  id: z.string(),
  payload: z.object({}).passthrough(),
  attrs: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    }),
  ),
})

export type HistoryItem = z.infer<typeof HistoryItemSchema>

export type TabType = 'sub' | 'topic'

export const TabDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['sub', 'topic']),
  isSelected: z.boolean().optional(),
})

type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type TabState = Prettify<
  z.infer<typeof TabDataSchema> & {
    hasActivity?: boolean
  }
>
