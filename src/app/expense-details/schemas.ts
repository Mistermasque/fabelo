import { z } from "zod"

export const CreateExpenseDetailSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  date: z.coerce.date(),
  amount: z.number().or(z.string()).pipe(z.coerce.number()),
  comment: z.string(),
})

export const UpdateExpenseDetailSchema = CreateExpenseDetailSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteExpenseDetailSchema = z.object({
  id: z.number(),
})
