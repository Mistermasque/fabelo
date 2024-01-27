import { z } from "zod"
import { CreateExpenseDetailSchema, UpdateExpenseDetailSchema } from "../expense-details/schemas"
import {
  CreateExpenseUserRatioSchema,
  UpdateExpenseUserRatioSchema,
} from "../expense-user-ratios/schemas"

export const CreateExpenseSchema = z.object({
  // template: __fieldName__: z.__zodType__(),
  comment: z.string(),
  details: z.array(CreateExpenseDetailSchema),
  ratios: z.array(CreateExpenseUserRatioSchema),
})
export const UpdateExpenseSchema = CreateExpenseSchema.merge(
  z.object({
    id: z.number(),
    details: z.array(UpdateExpenseDetailSchema),
    ratios: z.array(UpdateExpenseUserRatioSchema),
  })
)

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})
