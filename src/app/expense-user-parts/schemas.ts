import { z } from "zod"

export const CreateExpenseUserPartSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  part: z.number().positive().optional(),
  amount: z.number(),
  isAmount: z.boolean(),
  userId: z.number(),
})
export const UpdateExpenseUserPartSchema = CreateExpenseUserPartSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteExpenseUserPartSchema = z.object({
  id: z.number(),
})
