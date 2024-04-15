import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import computeTotalAmount from "../../../../db/computeTotalAmount"

interface GetNotRefundedExpensesInput
  extends Pick<Prisma.ExpenseFindManyArgs, "where" | "orderBy"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy }: GetNotRefundedExpensesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant

    if (!where) {
      where = { refund: null }
    } else {
      where.refund = null
    }
    const expenses = await db.expense.findMany({
      where,
      orderBy,
      include: {
        details: true,
        user: { select: { name: true } },
        parts: { include: { user: { select: { name: true } } } },
      },
    })

    return expenses.map((expense) => {
      return computeTotalAmount(expense)
    })
  }
)
