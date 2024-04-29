import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import computeTotalAmount from "@/db/virtual-fields/computeTotalAmount"
import computeBalances from "@/db/virtual-fields/computeBalances"

const GetRefund = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetRefund), resolver.authorize(), async ({ id }) => {
  const refund = await db.refund.findFirst({
    where: { id },
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
  })

  if (!refund) throw new NotFoundError()

  const expenses = refund.expenses.map((expense) => {
    return computeTotalAmount(expense)
  })

  const refundWithBalances = computeBalances({
    ...refund,
    expenses,
  })

  return computeTotalAmount(refundWithBalances)
})
