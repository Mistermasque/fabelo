import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateExpenseUserRatioSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateExpenseUserRatioSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserRatio = await db.expenseUserRatio.create({ data: input })

    return expenseUserRatio
  }
)
