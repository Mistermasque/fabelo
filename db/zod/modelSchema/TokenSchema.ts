import { z } from "zod"

/////////////////////////////////////////
// TOKEN SCHEMA
/////////////////////////////////////////

export const TokenSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  hashedToken: z.string(),
  type: z.string(),
  expiresAt: z.coerce.date(),
  sentTo: z.string(),
  userId: z.number().int(),
})

export type Token = z.infer<typeof TokenSchema>

export default TokenSchema
