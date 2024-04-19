import { z } from "zod"

export const TokenScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "hashedToken",
  "type",
  "expiresAt",
  "sentTo",
  "userId",
])

export default TokenScalarFieldEnumSchema
