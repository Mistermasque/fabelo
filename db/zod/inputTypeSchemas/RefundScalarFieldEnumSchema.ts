import { z } from "zod"

export const RefundScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "comment",
  "date",
  "isValidated",
  "userId",
])

export default RefundScalarFieldEnumSchema
