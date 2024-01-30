import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetExpenseUserPartsInput
  extends Pick<Prisma.ExpenseUserPartFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetExpenseUserPartsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: expenseUserParts,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.expenseUserPart.count({ where }),
      query: (paginateArgs) => db.expenseUserPart.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      expenseUserParts,
      nextPage,
      hasMore,
      count,
    }
  }
)
