import { resolver } from "@blitzjs/rpc"
import db from "db"
import { DeleteUserSchema } from "../schemas"

export default resolver.pipe(
  resolver.zod(DeleteUserSchema),
  resolver.authorize(),
  async ({ id }) => {
    // Vérification si le user est rattaché à d'autres enregistrements
    const existingUser = await db.user.findFirst({
      where: { id: id },
      select: {
        _count: {
          select: {
            expenses: true,
            refunds: true,
            expenseUserParts: true,
          },
        },
      },
    })

    const isUserAssociated =
      existingUser &&
      (existingUser._count.expenses > 0 ||
        existingUser._count.refunds > 0 ||
        existingUser._count.expenseUserParts > 0)

    if (!isUserAssociated) {
      const user = await db.user.deleteMany({ where: { id } })
      return user
    }

    db.token.deleteMany({ where: { userId: id } })
    db.session.deleteMany({ where: { userId: id } })

    const user = db.user.update({
      where: { id },
      data: {
        isActive: false,
        lastConnection: null,
        role: null,
      },
    })

    return user
  }
)
