import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateExpenseUserRatioSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateExpenseUserRatioSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserRatio = await db.expenseUserRatio.update({
      where: { id },
      data,
    })

    return expenseUserRatio
  }
)
