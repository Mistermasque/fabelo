import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateExpenseUserPartSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateExpenseUserPartSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseUserPart = await db.expenseUserPart.update({
      where: { id },
      data,
    })

    return expenseUserPart
  }
)
