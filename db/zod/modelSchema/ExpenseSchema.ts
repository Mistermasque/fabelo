import { z } from "zod"

/////////////////////////////////////////
// EXPENSE SCHEMA
/////////////////////////////////////////

export const ExpenseSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isDefaultParts: z.boolean(),
  refundId: z.number().int().nullable(),
  userId: z.number().int(),
})

export type Expense = z.infer<typeof ExpenseSchema>

export default ExpenseSchema
