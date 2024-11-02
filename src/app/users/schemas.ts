import { z } from "zod"

// TODO ce type devra être créé à partir du type Prisma en postgres
export const RoleField = z.enum(["ADMIN", "USER"])
export type Role = z.infer<typeof RoleField>

// TODO ce type devra être créé à partir du type Prisma en postgres
export const UserStatusField = z.enum(["NOT_ACTIVATED", "ACTIVE", "DISABLED"])
export type UserStatus = z.infer<typeof UserStatusField>

export const GetUserSchema = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export const DeleteUserSchema = z.object({
  id: z.number(),
})

export const UpdateUserSchema = z.object({
  id: z.number(),
  role: RoleField,
})
