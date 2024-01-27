import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateRefundSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateRefundSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const refund = await db.refund.update({ where: { id }, data })

    return refund
  }
)
