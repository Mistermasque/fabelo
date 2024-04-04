import { z } from "zod"

export const CreateRefundSchema = z.object({
  comment: z.string().optional(),
  date: z.coerce.date().optional(),
  isValidated: z.coerce.boolean().optional(),

  // expensesId correspond à un tableau de CreateExpenseDetailSchema avec min un élément
  // on utilise donc l'astuce des tuples variables : https://github.com/colinhacks/zod#tuples
  // expenseIds: z.array(z.coerce.number()),
  expenseIds: z
    .array(z.coerce.number())
    .refine((val) => val.length > 0, { message: "Vous devez choisir au moins 1 dépense" }),
})
export const UpdateRefundSchema = CreateRefundSchema.merge(
  z.object({
    id: z.number(),
  })
)

export const DeleteRefundSchema = z.object({
  id: z.number(),
})
