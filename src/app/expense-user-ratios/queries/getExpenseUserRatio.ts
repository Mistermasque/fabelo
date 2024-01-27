import { NotFoundError } from "blitz"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const GetExpenseUserRatio = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(
  resolver.zod(GetExpenseUserRatio),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserRatio = await db.expenseUserRatio.findFirst({
      where: { id },
    })

    if (!expenseUserRatio) throw new NotFoundError()

    return expenseUserRatio
  }
)
