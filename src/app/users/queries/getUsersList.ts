import { resolver } from "@blitzjs/rpc"
import db, { Prisma } from "db"

interface GetUsersListInput extends Pick<Prisma.UserFindManyArgs, "where" | "orderBy"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy }: GetUsersListInput) => {
    orderBy = orderBy ?? { name: "asc" }
    const users = await db.user.findMany({
      select: { id: true, name: true },
      orderBy,
      where,
    })

    const ret = users.map((user) => {
      return {
        value: user.id,
        title: user.name,
      }
    })

    return ret
  }
)
