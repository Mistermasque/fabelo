import { z } from "zod"

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "email",
  "hashedPassword",
  "role",
])

export default UserScalarFieldEnumSchema
