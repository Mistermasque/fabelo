import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteExpenseSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteExpenseSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expense = await db.expense.deleteMany({ where: { id } })

    return expense
  }
)
