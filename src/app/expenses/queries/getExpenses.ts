import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z, ZodTypeAny } from "zod"

import { ExpenseRecord } from "../../../../db/types"
import computeTotalAmount from "../../../../db/computeTotalAmount"

const zodInputStringPipe = (zodPipe: ZodTypeAny) =>
  z
    .string()
    .transform((value) => (value === "" ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: "Nombre Invalide",
    })
    .transform((value) => (value === null ? 0 : Number(value)))
    .pipe(zodPipe)

export const FilterExpensesSchema = z.object({
  isPaid: z.coerce.boolean().nullable().optional().or(z.string().max(0)),
  payorId: zodInputStringPipe(z.number().positive("Le nombre doit être supérieur à 0")),
  dateMin: z.coerce.date().nullable().optional().or(z.string().max(0)),
  dateMax: z.coerce.date().nullable().optional().or(z.string().max(0)),
  title: z.string().optional(),
})

interface GetExpensesInput
  extends Pick<Prisma.ExpenseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  filter?: z.infer<typeof FilterExpensesSchema>
  includeRefund?: boolean
}

function isValueActive(value: string | null | undefined | number | boolean | Date): boolean {
  return value !== undefined && value !== null && value !== ""
}

function convertFilterToWhereClause(
  filter: z.infer<typeof FilterExpensesSchema>
): Prisma.ExpenseWhereInput {
  let ret: Prisma.ExpenseWhereInput = {}

  if (isValueActive(filter.isPaid)) {
    ret.refund = {
      isValidated: Boolean(filter.isPaid),
    }
  }

  if (isValueActive(filter.payorId)) {
    ret.userId = Number(filter.payorId)
  }

  if (isValueActive(filter.dateMin) || isValueActive(filter.dateMax)) {
    ret.createdAt = {
      gte: filter.dateMin ? filter.dateMin : undefined,
      lte: filter.dateMax ? filter.dateMax : undefined,
    }
  }

  if (isValueActive(filter.title)) {
    ret.title = {
      contains: filter.title,
    }
  }

  return ret
}

export default resolver.pipe(
  resolver.authorize(),
  async ({
    where,
    filter,
    orderBy,
    skip = 0,
    take = 100,
    includeRefund = false,
  }: GetExpensesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    // Validate the input
    const parsedFilters = FilterExpensesSchema.safeParse(filter)
    if (parsedFilters.success) {
      where = {
        ...convertFilterToWhereClause(parsedFilters.data),
        ...where,
      }
    }

    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.expense.count({ where }),
      query: (paginateArgs) =>
        db.expense.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            details: true,
            user: { select: { name: true } },
            parts: { include: { user: { select: { name: true } } } },
            refund: includeRefund ? { include: { user: { select: { name: true } } } } : false,
          },
        }),
    })

    const expenses = items.map((expense) => {
      return computeTotalAmount(expense)
    })

    return {
      expenses,
      nextPage,
      hasMore,
      count,
    }
  }
)
