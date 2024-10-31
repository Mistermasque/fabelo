import computeRoleText from "@/db/virtual-fields/computeRoleText"
import { resolver } from "@blitzjs/rpc"
import db from "db"

export default resolver.pipe(resolver.authorize(), async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
      email: true,
      role: true,
      lastConnection: true,
    },
  })

  return users.map((user) => computeRoleText(user))
})
