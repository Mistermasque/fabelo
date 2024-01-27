import { z } from "zod"

export const CreateExpenseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
})
export const UpdateExpenseSchema = CreateExpenseSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})
