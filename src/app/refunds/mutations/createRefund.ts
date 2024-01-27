import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateRefundSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(CreateRefundSchema),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const refund = await db.refund.create({ data: input })

    return refund
  }
)
