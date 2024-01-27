import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteExpenseUserRatioSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteExpenseUserRatioSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserRatio = await db.expenseUserRatio.deleteMany({
      where: { id },
    })

    return expenseUserRatio
  }
)
