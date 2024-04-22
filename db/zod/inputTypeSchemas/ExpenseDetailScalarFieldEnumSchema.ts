import { z } from "zod"

export const ExpenseDetailScalarFieldEnumSchema = z.enum([
  "id",
  "date",
  "amount",
  "comment",
  "expenseId",
])

export default ExpenseDetailScalarFieldEnumSchema
