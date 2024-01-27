import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetExpensesInput
  extends Pick<Prisma.ExpenseFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

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
      query: (paginateArgs) => db.expense.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      expenses,
      nextPage,
      hasMore,
      count,
    }
  }
)
