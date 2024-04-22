import { z } from "zod"
import { Prisma } from "@prisma/client"

/////////////////////////////////////////
// EXPENSE USER PART SCHEMA
/////////////////////////////////////////

export const ExpenseUserPartSchema = z.object({
  id: z.number().int(),
  part: z
    .instanceof(Prisma.Decimal, {
      message: "Field 'part' must be a Decimal. Location: ['Models', 'ExpenseUserPart']",
    })
    .nullable(),
  amount: z.instanceof(Prisma.Decimal, {
    message: "Field 'amount' must be a Decimal. Location: ['Models', 'ExpenseUserPart']",
  }),
  isAmount: z.boolean(),
  userId: z.number().int(),
  expenseId: z.number().int(),
})

export type ExpenseUserPart = z.infer<typeof ExpenseUserPartSchema>

export default ExpenseUserPartSchema
