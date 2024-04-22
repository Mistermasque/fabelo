import { Prisma } from "@prisma/client"
import { z } from "zod"
import Decimal from "decimal.js"
import { isValidDecimalInput, DecimalJsLikeSchema } from "@/db/zod/inputTypeSchemas"

////////////////////////// EXPENSE DETAILS ////////////////////////

export const CreateExpenseDetailSchema = z.object({
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

export type CreateExpenseDetailInput = z.input<typeof CreateExpenseDetailSchema>

export const UpdateExpenseDetailSchema = z.object({
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

export type UpdateExpenseDetailInput = z.input<typeof UpdateExpenseDetailSchema>

export const DeleteExpenseDetailSchema = z.object({
  id: z.number(),
})

export type DeleteExpenseDetailInput = z.input<typeof DeleteExpenseDetailSchema>

////////////////////////// EXPENSE USER PART ////////////////////////

export const CreateExpenseUserPartSchema: z.ZodType<Prisma.ExpenseUserPartUncheckedCreateWithoutExpenseInput> =
  z.object({
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
    expenseId: z.number().int().optional(),
  })

export type CreateExpenseUserPartInput = z.input<typeof CreateExpenseUserPartSchema>

export const UpdateExpenseUserPartSchema = z.object({
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
    .refine((v) => isValidDecimalInput(v) && v >= 0, { message: "Doit être un nombre positif" }),
  isAmount: z.boolean().optional(),
  userId: z.number(),
})

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

      const totalAmountParts = schema.parts.reduce((accumulator, part) => {
        return accumulator + Number(part.amount)
      }, 0)

      return (
        totalAmountParts == totalAmount &&
        schema.parts.findIndex((part) => part.amount > totalAmount) === -1
      )
    }
    return true
  }, "Le montant des parts n'est pas cohérent avec le montant global de la dépense")

export type CreateExpenseInput = z.input<typeof CreateExpenseSchema>

export const UpdateExpenseSchema = z
  .object({
    id: z.number(),
    createdAt: z.coerce.date().nullable().optional(),
    updatedAt: z.coerce.date().nullable().optional(),
    userId: z.number().int().or(z.coerce.number()).optional(),
    title: z.string().min(1).optional(),
    isDefaultParts: z.boolean().optional(),
    // details correspond à un tableau de UpdateExpenseDetailSchema avec min un élément
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
  .refine((schema) => {
    // Vérification si l'une des parts dépasse le montant total
    if (schema.parts.length > 0) {
      const totalAmount = schema.details.reduce((accumulator, detail) => {
        return accumulator + Number(detail.amount)
      }, 0)

      const totalAmountParts = schema.parts.reduce((accumulator, part) => {
        return accumulator + Number(part.amount)
      }, 0)

      return (
        totalAmountParts == totalAmount &&
        schema.parts.findIndex((part) => part.amount > totalAmount) === -1
      )
    }
    return true
  }, "Le montant des parts n'est pas cohérent avec le montant global de la dépense")

export type UpdateExpenseInput = z.input<typeof UpdateExpenseSchema>

export const DeleteExpenseSchema = z.object({
  id: z.number(),
})

export type DeleteExpenseInput = z.input<typeof DeleteExpenseSchema>

export const FilterExpensesSchema = z.object({
  isPaid: z
    .union([z.literal("true"), z.literal("false")])
    .or(z.string().max(0))
    .or(z.boolean())
    .nullable()
    .optional()
    .transform((val) => {
      if (val === "true" || val === true) {
        return true
      }
      if (val === "false" || val === false) {
        return false
      }
      return null
    }),
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
