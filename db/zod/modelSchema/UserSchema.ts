import { z } from "zod"

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  name: z.string(),
  email: z.string(),
  hashedPassword: z.string().nullable(),
  role: z.string().nullable(),
  status: z.string(),
  lastConnection: z.coerce.date().nullable(),
})

export type User = z.infer<typeof UserSchema>

export default UserSchema
