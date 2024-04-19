import { Prisma } from "@prisma/client"
import { z, ZodTypeAny } from "zod"
import Decimal from "decimal.js"
import { isValidDecimalInput, DecimalJsLikeSchema } from "@/db/zod/inputTypeSchemas"

////////////////////////// EXPENSE DETAILS ////////////////////////

export const CreateExpenseDetailSchema: z.ZodType<Prisma.ExpenseDetailCreateWithoutExpenseInput> =
  z.object({
    expenseId: z.number().int().optional(),
    date: z.coerce.date(),
    amount: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v) && v != 0, { message: "Doit être un nombre non null" }),
    comment: z.string().optional().nullable(),
  })
// .strict()

export type CreateExpenseDetailInput = z.input<typeof CreateExpenseDetailSchema>

export const UpdateExpenseDetailSchema = z
  .object({
    id: z.number(),
    expenseId: z.number().int().optional(),
    date: z.coerce.date(),
    amount: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v) && v != 0, { message: "Doit être un nombre non null" }),
    comment: z.string().optional().nullable(),
  })
  .strict()

export type UpdateExpenseDetailInput = z.input<typeof UpdateExpenseDetailSchema>

export const DeleteExpenseDetailSchema = z.object({
  id: z.number(),
})

export type DeleteExpenseDetailInput = z.input<typeof DeleteExpenseDetailSchema>

////////////////////////// EXPENSE USER PART ////////////////////////

export const CreateExpenseUserPartSchema: z.ZodType<Prisma.ExpenseUserPartUncheckedCreateWithoutExpenseInput> =
  z
    .object({
      part: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v) && v >= 0, { message: "Doit être un nombre positif" })
        .optional()
        .nullable(),
      amount: z
        .union([
          z.number(),
          z.string(),
          z.instanceof(Decimal),
          z.instanceof(Prisma.Decimal),
          DecimalJsLikeSchema,
        ])
        .refine((v) => isValidDecimalInput(v) && v >= 0, {
          message: "Doit être un nombre positif",
        }),
      isAmount: z.boolean().optional(),
      userId: z.number(),
    })
    .strict()

export type CreateExpenseUserPartInput = z.input<typeof CreateExpenseUserPartSchema>

export const UpdateExpenseUserPartSchema = z
  .object({
    id: z.number(),
    part: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])

      .refine((v) => isValidDecimalInput(v), { message: "Doit être un nombre" })
      .refine((v) => v > 0, { message: "Doit être un nombre positif" })
      .optional()
      .nullable(),
    amount: z
      .union([
        z.number(),
        z.string(),
        z.instanceof(Decimal),
        z.instanceof(Prisma.Decimal),
        DecimalJsLikeSchema,
      ])
      .refine((v) => isValidDecimalInput(v), { message: "Doit être un nombre" })
      .refine((v) => v > 0, { message: "Doit être un nombre positif" }),
    isAmount: z.boolean().optional(),
    userId: z.number(),
  })
  .strict()

export type UpdateExpenseUserPartInput = z.input<typeof UpdateExpenseUserPartSchema>

export const DeleteExpenseUserPartSchema = z.object({
  id: z.number(),
})

export type DeleteExpenseUserPartInput = z.input<typeof DeleteExpenseUserPartSchema>

////////////////////////// EXPENSE ////////////////////////

export const CreateExpenseSchema = z
  .object({
    userId: z.number().int().or(z.coerce.number()).optional(),
    title: z.string().min(1),
    isDefaultParts: z.boolean().optional(),
    // details correspond à un tableau de CreateExpenseDetailSchema avec min un élément
    details: z
      .array(CreateExpenseDetailSchema)
      .refine((val) => val.length > 0, { message: "Vous devez mettre au moins un détail" }),
    parts: z.array(CreateExpenseUserPartSchema),
  })
  .refine((schema) => {
    if (schema.isDefaultParts === false) {
      return schema.parts.length > 0
    }
    return true
  }, "Vous devez obligatoirement définir les parts de chacun si vous n'appliquez pas les parts par défaut.")
  .refine((schema) => {
    // Vérification si l'une des parts dépasse le montant total
    if (schema.parts.length > 0) {
      const totalAmount = schema.details.reduce((accumulator, detail) => {
        return accumulator + Number(detail.amount)
      }, 0)

      return schema.parts.findIndex((part) => part.amount > totalAmount) === -1
    }
    return true
  }, "Le montant des parts n'est pas cohérent avec le montant global de la dépense")

export type CreateExpenseInput = z.input<typeof CreateExpenseSchema>

export const UpdateExpenseSchema = z
  .object({
    id: z.number(),
    userId: z.number().int().or(z.coerce.number()).optional(),
    title: z.string().min(1).optional(),
    isDefaultParts: z.boolean().optional(),
    // details correspond à un tableau de CreateExpenseDetailSchema avec min un élément
    details: z
      .array(UpdateExpenseDetailSchema)
      .refine((val) => val.length > 0, { message: "Vous devez mettre au moins un détail" }),
    parts: z.array(UpdateExpenseUserPartSchema),
  })
  .refine((schema) => {
    if (schema.isDefaultParts === true) {
      return schema.parts.length > 0
    }
    return true
  }, "Vous devez obligatoirement définir les parts de chacun si vous n'appliquez pas les parts par défaut.")

export type UpdateExpenseInput = z.input<typeof UpdateExpenseSchema>

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})

export type DeleteExpenseInput = z.input<typeof DeleteExpenseSchema>

export const FilterExpensesSchema = z.object({
  isPaid: z.coerce.boolean().nullable().optional().or(z.string().max(0)),
  payorId: z.coerce
    .number()
    .int()
    .positive("Le nombre doit être supérieur à 0")
    .or(z.string().max(0))
    .nullable()
    .optional(),
  dateMin: z.coerce.date().nullable().optional().or(z.string().max(0)),
  dateMax: z.coerce.date().nullable().optional().or(z.string().max(0)),
  title: z.string().optional(),
})

export type FilterExpensesInput = z.input<typeof FilterExpensesSchema>
