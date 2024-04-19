import { z } from "zod"

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  expiresAt: z.coerce.date().nullable(),
  handle: z.string(),
  hashedSessionToken: z.string().nullable(),
  antiCSRFToken: z.string().nullable(),
  publicData: z.string().nullable(),
  privateData: z.string().nullable(),
  userId: z.number().int().nullable(),
})

export type Session = z.infer<typeof SessionSchema>

export default SessionSchema
