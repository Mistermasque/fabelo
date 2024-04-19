import { z } from "zod"

export const ExpenseUserPartScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "part",
  "amount",
  "isAmount",
  "userId",
  "expenseId",
])

export default ExpenseUserPartScalarFieldEnumSchema
