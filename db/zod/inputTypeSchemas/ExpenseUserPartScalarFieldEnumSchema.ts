import { z } from "zod"

export const ExpenseUserPartScalarFieldEnumSchema = z.enum([
  "id",
  "part",
  "amount",
  "isAmount",
  "userId",
  "expenseId",
])

export default ExpenseUserPartScalarFieldEnumSchema
