import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateExpenseUserPartSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateExpenseUserPartSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserPart = await db.expenseUserPart.create({ data: input })

    return expenseUserPart
  }
)
