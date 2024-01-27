import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateExpenseSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateExpenseSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expense = await db.expense.create({ data: input })

    return expense
  }
)
