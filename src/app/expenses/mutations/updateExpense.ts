import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateExpenseSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateExpenseSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expense = await db.expense.update({ where: { id }, data })

    return expense
  }
)
