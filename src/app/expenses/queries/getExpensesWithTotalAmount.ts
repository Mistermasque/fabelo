import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { z, ZodTypeAny } from "zod"

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

export const FilterExpensesWithTotalAmountSchema = z.object({
  isPaid: z.coerce.boolean().nullable().optional().or(z.string().max(0)),
  payorId: zodInputStringPipe(z.number().positive("Le nombre doit être supérieur à 0")),
  dateMin: z.coerce.date().nullable().optional().or(z.string().max(0)),
  dateMax: z.coerce.date().nullable().optional().or(z.string().max(0)),
  title: z.string().optional(),
})

export type FilterExpensesWithTotalAmountType = z.infer<typeof FilterExpensesWithTotalAmountSchema>

interface GetExpensesWithTotalAmountInput
  extends Pick<Prisma.ExpenseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  filter?: FilterExpensesWithTotalAmountType
}

export type ExpenseWithTotalAmount = Prisma.ExpenseGetPayload<{
  include: { details: true; refund: true; user: true; parts: { include: { user: true } } }
}> & {
  totalAmount: number
}

function isValueActive(value: string | null | undefined | number | boolean | Date): boolean {
  return value !== undefined && value !== null && value !== ""
}

function convertFilterToWhereClause(
  filter: FilterExpensesWithTotalAmountType
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
  async ({ where, filter, orderBy, skip = 0, take = 100 }: GetExpensesWithTotalAmountInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    // Validate the input
    const parsedFilters = FilterExpensesWithTotalAmountSchema.safeParse(filter)
    if (parsedFilters.success) {
      where = {
        ...convertFilterToWhereClause(parsedFilters.data),
        ...where,
      }
    }

    const {
      items: expenses,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.expense.count({ where }),
      query: (paginateArgs) =>
        db.expense.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: { details: true, refund: true, user: true, parts: { include: { user: true } } },
        }),
    })

    const expensesWithTotalAmount: ExpenseWithTotalAmount[] = expenses.map((expense) => {
      const totalAmount = expense?.details.reduce((accumulator, detail) => {
        return accumulator + Number(detail.amount)
      }, 0)
      return { ...expense, ...{ totalAmount: totalAmount } }
    })

    return {
      expenses: expensesWithTotalAmount,
      nextPage,
      hasMore,
      count,
    }
  }
)
