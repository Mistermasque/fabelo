import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import computeTotalAmount from "@/db/virtual-fields/computeTotalAmount"
import computeBalances from "@/db/virtual-fields/computeBalances"

interface GetRefundsInput
  extends Pick<Prisma.RefundFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetRefundsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.refund.count({ where }),
      query: (paginateArgs) =>
        db.refund.findMany({
          ...paginateArgs,
          where,
          orderBy,
          include: {
            user: { select: { id: true, name: true } },
            expenses: {
              include: {
                details: true,
                user: { select: { id: true, name: true } },
                parts: { include: { user: { select: { id: true, name: true } } } },
              },
            },
          },
        }),
    })

    const refunds = items.map((refund) => {
      const expenses = refund.expenses.map((expense) => {
        return computeTotalAmount(expense)
      })

      return computeBalances({
        ...refund,
        expenses,
      })
    })

    return {
      refunds,
      nextPage,
      hasMore,
      count,
    }
  }
)
