import { z } from "zod"
import { CreateExpenseDetailSchema, UpdateExpenseDetailSchema } from "../expense-details/schemas"
import {
  CreateExpenseUserRatioSchema,
  UpdateExpenseUserRatioSchema,
} from "../expense-user-ratios/schemas"

export const CreateExpenseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  // details correspond à un tablea de CreateExpenseDetailSchema avec min un élément
  // on utilise donc l'astuce des tuples variables : https://github.com/colinhacks/zod#tuples
  details: z.tuple([CreateExpenseDetailSchema]).rest(CreateExpenseDetailSchema),
  // ratios: z.array(CreateExpenseUserRatioSchema),
})
export const UpdateExpenseSchema = CreateExpenseSchema.merge(
  z.object({
    id: z.number(),
    details: z.array(UpdateExpenseDetailSchema),
    // ratios: z.array(UpdateExpenseUserRatioSchema),
  })
)

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})
