import db from "db"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { Role, ActivateSchema } from "../schemas"
import { resolver } from "@blitzjs/rpc"
import { hash256 } from "@blitzjs/auth"

export class ActivateError extends Error {
  name = "ActivateError"
  message = "Le lien d'activation de votre compte est invalide ou a expiré."
}

export default resolver.pipe(
  resolver.zod(ActivateSchema),
  async ({ password, name, token }, ctx) => {
    if (!token) {
      throw new ActivateError("Le token est requis")
    }

    const blitzContext = ctx

    // 1. Try to find this token in the database
    const hashedToken = hash256(token)
    const possibleToken = await db.token.findFirst({
      where: { hashedToken, type: "NEW_USER" },
      include: { user: true },
    })

    // 2. If token not found, error
    if (!possibleToken) {
      throw new ActivateError()
    }
    const savedToken = possibleToken

    // 3. Delete token so it can't be used again
    await db.token.delete({ where: { id: savedToken.id } })

    // 4. If token has expired, error
    if (savedToken.expiresAt < new Date()) {
      throw new ActivateError()
    }

    // 5. Since token is valid, now we can update the user's password, name and status
    const hashedPassword = await SecurePassword.hash(password.trim())
    const user = await db.user.update({
      where: { id: savedToken.userId },
      data: { hashedPassword, name, status: "ACTIVE" },
    })

    // 6. Création de la session courante pour l'utilisateur
    await blitzContext.session.$create({
      userId: user.id,
      // TODO supprimer ce cast une fois passé en postgres
      role: user.role as Role,
    })

    return user
  }
)
