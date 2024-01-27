import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateExpenseDetailSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateExpenseDetailSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const expenseDetail = await db.expenseDetail.update({
      where: { id },
      data,
    })

    return expenseDetail
  }
)
