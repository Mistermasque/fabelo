import { paginate } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetRefundsInput
  extends Pick<Prisma.RefundFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetRefundsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: refunds,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.refund.count({ where }),
      query: (paginateArgs) => db.refund.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      refunds,
      nextPage,
      hasMore,
      count,
    }
  }
)
