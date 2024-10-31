import { z } from "zod"

export const GetUserSchema = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export const DeleteUserSchema = z.object({
  id: z.number(),
})

export const UpdateUserSchema = z.object({
  id: z.number(),
  role: z.string(),
})
