import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetExpenseDetailsInput
  extends Pick<Prisma.ExpenseDetailFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetExpenseDetailsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: expenseDetails,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.expenseDetail.count({ where }),
      query: (paginateArgs) => db.expenseDetail.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      expenseDetails,
      nextPage,
      hasMore,
      count,
    }
  }
)
