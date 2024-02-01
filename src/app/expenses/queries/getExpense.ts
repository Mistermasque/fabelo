import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetExpense = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetExpense), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const expense = await db.expense.findFirst({
    where: { id },
    include: {
      user: { select: { name: true, hashedPassword: false } },
      details: true,
      parts: { include: { user: { select: { name: true, hashedPassword: false } } } },
    },
  })

  if (!expense) throw new NotFoundError()

  return expense
})
