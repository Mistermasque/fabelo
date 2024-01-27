import { z } from "zod"

export const CreateRefundSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateRefundSchema = CreateRefundSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteRefundSchema = z.object({
  id: z.number(),
})
