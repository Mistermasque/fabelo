import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { FilterExpensesSchema, FilterExpensesInput } from "../schemas"
import computeTotalAmount from "@/db/virtual-fields/computeTotalAmount"

interface GetExpensesInput
  extends Pick<Prisma.ExpenseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {
  filter?: FilterExpensesInput
  includeRefund?: boolean
}

function isValueActive(value: string | null | undefined | number | boolean | Date): boolean {
  return value !== undefined && value !== null && value !== ""
}

function convertFilterToWhereClause(filter: FilterExpensesInput): Prisma.ExpenseWhereInput {
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
