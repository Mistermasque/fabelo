import { resolver } from "@blitzjs/rpc"
import db from "db"
import { CreateRefundSchema } from "../schemas"
import { Ctx } from "blitz"

export default resolver.pipe(
  resolver.zod(CreateRefundSchema),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    if (!ctx.session.userId) return null

    const data = {
      userId: ctx.session.userId,
      comment: input.comment,
      isValidated: input.isValidated,
      date: input.date,
      expenses: { connect: input.expenseIds.map((id) => ({ id })) },
    }

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const refund = await db.refund.create({ data: data })

    return refund
  }
)
