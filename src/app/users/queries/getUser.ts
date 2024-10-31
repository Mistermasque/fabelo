import { resolver } from "@blitzjs/rpc"
import db from "db"
import { NotFoundError } from "blitz"
import { GetUserSchema } from "../schemas"
import computeRoleText from "@/db/virtual-fields/computeRoleText"

export default resolver.pipe(resolver.zod(GetUserSchema), resolver.authorize(), async ({ id }) => {
  const user = await db.user.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      isActive: true,
      email: true,
      role: true,
      lastConnection: true,
    },
  })

  if (!user) throw new NotFoundError()

  return computeRoleText(user)
})
