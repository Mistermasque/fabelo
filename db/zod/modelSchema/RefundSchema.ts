import { z } from "zod"

/////////////////////////////////////////
// REFUND SCHEMA
/////////////////////////////////////////

export const RefundSchema = z.object({
  id: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  comment: z.string().nullable(),
  date: z.coerce.date().nullable(),
  isValidated: z.boolean(),
  userId: z.number().int(),
})

export type Refund = z.infer<typeof RefundSchema>

export default RefundSchema
