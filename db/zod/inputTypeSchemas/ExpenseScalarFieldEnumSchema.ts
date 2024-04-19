import { z } from "zod"

export const ExpenseScalarFieldEnumSchema = z.enum([
  "id",
  "title",
  "createdAt",
  "updatedAt",
  "isDefaultParts",
  "refundId",
  "userId",
])

export default ExpenseScalarFieldEnumSchema
