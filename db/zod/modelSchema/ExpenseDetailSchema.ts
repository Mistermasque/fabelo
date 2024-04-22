import { z } from "zod"
import { Prisma } from "@prisma/client"

/////////////////////////////////////////
// EXPENSE DETAIL SCHEMA
/////////////////////////////////////////

export const ExpenseDetailSchema = z.object({
  id: z.number().int(),
  date: z.coerce.date(),
  amount: z.instanceof(Prisma.Decimal, {
    message: "Field 'amount' must be a Decimal. Location: ['Models', 'ExpenseDetail']",
  }),
  comment: z.string().nullable(),
  expenseId: z.number().int(),
})

export type ExpenseDetail = z.infer<typeof ExpenseDetailSchema>

export default ExpenseDetailSchema
