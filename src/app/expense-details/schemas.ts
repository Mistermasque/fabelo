import { z } from "zod"

export const CreateExpenseDetailSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  date: z.coerce.date(),
  amount: z
    .number()
    .or(z.string())
    .pipe(z.coerce.number())
    .refine((val) => val !== 0, { message: "Le montant ne pas être égal à 0" }),
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
