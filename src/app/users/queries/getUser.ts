import { resolver } from "@blitzjs/rpc"
import db from "db"
import { NotFoundError } from "blitz"
import { GetUserSchema, Role, UserStatus } from "../schemas"
import computeRoleText from "@/db/virtual-fields/computeRoleText"
import computeUserStatusText from "@/db/virtual-fields/computeUserStatusText"

export default resolver.pipe(resolver.zod(GetUserSchema), resolver.authorize(), async ({ id }) => {
  const user = await db.user.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
      email: true,
      role: true,
      lastConnection: true,
    },
  })

  if (!user) throw new NotFoundError()
  // TODO ne plus caster les roles et status une fois passé sur PostGres
  const uWithRoleText = computeRoleText({ role: user.role as Role })
  const uWithStatusText = computeUserStatusText({ status: user.status as UserStatus })
  return {
    ...user,
    ...uWithRoleText,
    ...uWithStatusText,
  }

  // return computeRoleText(user)
})
