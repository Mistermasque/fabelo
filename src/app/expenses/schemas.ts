import { z } from "zod"
import { CreateExpenseDetailSchema } from "../expense-details/schemas"
import { CreateExpenseUserPartSchema } from "../expense-user-parts/schemas"

export const CreateExpenseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  userId: z.coerce.number(),
  title: z.string().min(1),
  isDefaultParts: z.boolean(),
  // details correspond à un tableau de CreateExpenseDetailSchema avec min un élément
  // on utilise donc l'astuce des tuples variables : https://github.com/colinhacks/zod#tuples
  details: z.tuple([CreateExpenseDetailSchema]).rest(CreateExpenseDetailSchema),
  parts: z.array(CreateExpenseUserPartSchema),
})
export const UpdateExpenseSchema = CreateExpenseSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})

export const FilterExpensesSchema = z.object({
  isPaid: z.coerce.boolean().nullable().optional(),
  payorId: z.coerce.number().nullable().optional(),
  dateMin: z.coerce.date().nullable().optional(),
  dateMax: z.coerce.date().nullable().optional(),
  title: z.string().nullable().optional(),
})
