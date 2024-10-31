import { z } from "zod"

export const UserScalarFieldEnumSchema = z.enum([
  "id",
  "createdAt",
  "updatedAt",
  "name",
  "email",
  "hashedPassword",
  "role",
  "isActive",
  "lastConnection",
])

export default UserScalarFieldEnumSchema
