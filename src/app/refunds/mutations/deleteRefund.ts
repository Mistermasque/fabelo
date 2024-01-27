import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteRefundSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteRefundSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const refund = await db.refund.deleteMany({ where: { id } })

    return refund
  }
)
