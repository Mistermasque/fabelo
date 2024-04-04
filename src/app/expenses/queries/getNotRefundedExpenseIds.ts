import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const expenses = await db.expense.findMany({
    where: { refund: null },
    select: { id: true },
  })

  const ret: number[] = expenses.map((expense) => {
    return expense.id
  })

  return ret
})
