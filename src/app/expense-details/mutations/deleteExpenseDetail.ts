import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteExpenseDetailSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteExpenseDetailSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseDetail = await db.expenseDetail.deleteMany({ where: { id } })

    return expenseDetail
  }
)
