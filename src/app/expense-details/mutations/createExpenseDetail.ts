import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateExpenseDetailSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateExpenseDetailSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseDetail = await db.expenseDetail.create({ data: input })

    return expenseDetail
  }
)
