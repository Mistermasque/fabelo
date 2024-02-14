import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetExpensesInput
  extends Pick<Prisma.ExpenseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export type ExpenseWithTotalAmount = Prisma.ExpenseGetPayload<{
  include: { details: true; refund: true; user: true }
}> & {
  totalAmount?: number
}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetExpensesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
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
          include: { details: true, refund: true, user: true },
        }),
    })

    expenses.map((expense: ExpenseWithTotalAmount) => {
      const totalAmount = expense?.details.reduce((accumulator, detail) => {
        return accumulator + Number(detail.amount)
      }, 0)
      expense.totalAmount = totalAmount
    })

    return {
      expenses,
      nextPage,
      hasMore,
      count,
    }
  }
)
