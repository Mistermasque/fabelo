import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"
import { UpdateExpenseSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateExpenseSchema),
  resolver.authorize(),
  async ({ ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { id, details, parts, userId, isDefaultParts } = data

    let createParts: Prisma.ExpenseUserPartCreateWithoutExpenseInput[] = []

    if (isDefaultParts) {
      const users = await db.user.findMany({ select: { id: true } })
      const total = details.reduce((accumulator, detail) => {
        return accumulator + Number(detail.amount)
      }, 0)
      const nbUsers = users.length
      const amount = total / nbUsers

      users.map((u) => {
        createParts.push({
          user: { connect: { id: u.id } },
          part: 1,
          isAmount: false,
          amount,
        })
      })
    } else {
      parts.map((p) => {
        const { part, isAmount, amount } = p

        createParts.push({
          user: { connect: { id: p.userId } },
          part,
          isAmount,
          amount,
        })
      })
    }

    const expense = await db.expense.update({
      where: { id },
      data: {
        isDefaultParts,
        user: { connect: { id: userId } },
        details: {
          deleteMany: { expenseId: id },
          create: details,
        },
        parts: {
          deleteMany: { expenseId: id },
          create: createParts,
        },
      },
      include: {
        user: { select: { name: true, id: true } },
        details: true,
        parts: { include: { user: { select: { name: true, id: true } } } },
        refund: { include: { user: { select: { name: true, id: true } } } },
      },
    })

    return expense
  }
)
