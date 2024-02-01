import { z } from "zod"
import { CreateExpenseDetailSchema, UpdateExpenseDetailSchema } from "../expense-details/schemas"
import {
  CreateExpenseUserPartSchema,
  UpdateExpenseUserPartSchema,
} from "../expense-user-parts/schemas"

export const CreateExpenseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  userId: z.coerce.number(),
  isDefaultParts: z.boolean(),
  // details correspond à un tableau de CreateExpenseDetailSchema avec min un élément
  // on utilise donc l'astuce des tuples variables : https://github.com/colinhacks/zod#tuples
  details: z.tuple([CreateExpenseDetailSchema]).rest(CreateExpenseDetailSchema),
  parts: z.array(CreateExpenseUserPartSchema),
})
export const UpdateExpenseSchema = CreateExpenseSchema.merge(
  z.object({
    id: z.number(),
    details: z.array(UpdateExpenseDetailSchema),
    parts: z.array(UpdateExpenseUserPartSchema),
  })
)

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})
