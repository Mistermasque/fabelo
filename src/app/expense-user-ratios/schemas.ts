import { z } from "zod"

export const CreateExpenseUserRatioSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  ratio: z.number(),
})
export const UpdateExpenseUserRatioSchema = CreateExpenseUserRatioSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteExpenseUserRatioSchema = z.object({
  id: z.number(),
})
