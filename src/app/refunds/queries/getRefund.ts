import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"
import computeTotalAmount from "@/db/computeTotalAmount"
import computeBalances from "@/db/computeBalances"

const GetRefund = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetRefund), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
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

  return computeBalances({
    ...refund,
    expenses,
  })
})
