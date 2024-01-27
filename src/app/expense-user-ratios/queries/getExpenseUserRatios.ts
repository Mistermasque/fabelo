import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetExpenseUserRatiosInput
  extends Pick<Prisma.ExpenseUserRatioFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetExpenseUserRatiosInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: expenseUserRatios,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.expenseUserRatio.count({ where }),
      query: (paginateArgs) => db.expenseUserRatio.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      expenseUserRatios,
      nextPage,
      hasMore,
      count,
    }
  }
)
