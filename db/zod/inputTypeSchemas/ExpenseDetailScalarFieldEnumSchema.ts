import { z } from "zod"

export const ExpenseDetailScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "date",
  "amount",
  "comment",
  "expenseId",
])

export default ExpenseDetailScalarFieldEnumSchema
