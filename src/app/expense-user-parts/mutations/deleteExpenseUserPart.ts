import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteExpenseUserPartSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteExpenseUserPartSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserPart = await db.expenseUserPart.deleteMany({
      where: { id },
    })

    return expenseUserPart
  }
)
