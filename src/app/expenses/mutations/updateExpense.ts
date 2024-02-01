import { resolver } from "@blitzjs/rpc"
import db from "db"
import { UpdateExpenseSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(UpdateExpenseSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { details, parts, userId, isDefaultParts } = data

    let createParts: {
      part?: number
      isAmount: boolean
      amount: number
      user: { connect: { id: number } }
    }[] = []

    if (isDefaultParts) {
      const users = await db.user.findMany({ select: { id: true } })
      const total = details.reduce((accumulator, detail) => {
        return accumulator + detail.amount
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
          deleteMany: {},
          create: details,
        },
        parts: {
          deleteMany: {},
          create: createParts,
        },
      },
      include: { details: true, parts: true, user: true },
    })

    return expense
  }
)
