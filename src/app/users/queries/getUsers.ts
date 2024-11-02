import computeRoleText from "@/db/virtual-fields/computeRoleText"
import { resolver } from "@blitzjs/rpc"
import db from "db"
import { Role, UserStatus } from "../schemas"
import computeUserStatusText from "@/db/virtual-fields/computeUserStatusText"

export default resolver.pipe(resolver.authorize(), async () => {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      email: true,
      role: true,
      lastConnection: true,
    },
  })

  // TODO ne plus caster les roles et status une fois passé sur PostGres
  return users.map(({ status, role, ...user }) => {
    const uWithRoleText = computeRoleText({ role: role as Role })
    const uWithStatusText = computeUserStatusText({ status: status as UserStatus })

    return {
      ...uWithRoleText,
      ...uWithStatusText,
      ...user,
    }
  })
})
