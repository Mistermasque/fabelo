import { z } from "zod"

export const SessionScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "expiresAt",
  "handle",
  "hashedSessionToken",
  "antiCSRFToken",
  "publicData",
  "privateData",
  "userId",
])

export default SessionScalarFieldEnumSchema
