import { z } from "zod"

export const CreateRefundSchema = z.object({
  comment: z.string().nullable().optional(),
  date: z.coerce.date().nullable().optional(),
  isValidated: z.coerce.boolean().nullable().optional(),

  // expensesId correspond à un tableau de CreateExpenseDetailSchema avec min un élément
  // on utilise donc l'astuce des tuples variables : https://github.com/colinhacks/zod#tuples
  // expenseIds: z.array(z.coerce.number()),
  expenseIds: z
    .array(z.coerce.number())
    .refine((val) => val.length > 0, { message: "Vous devez choisir au moins 1 dépense" }),
})
export const UpdateRefundSchema = z.object({
  id: z.number(),
  comment: z.string().nullable().optional(),
  date: z.coerce.date().nullable().optional(),
  isValidated: z.coerce.boolean().nullable().optional(),
})

export const DeleteRefundSchema = z.object({
  id: z.number(),
})
