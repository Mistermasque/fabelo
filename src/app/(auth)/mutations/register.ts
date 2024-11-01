import db from "db"
import { RegisterSchema } from "../schemas"
import { resolver } from "@blitzjs/rpc"
import { generateToken, hash256 } from "@blitzjs/auth"
import { newUserMailer } from "mailers/newUserMailer"

const REGISTER_USER_TOKEN_EXPIRATION_IN_DAYS = 7

export default resolver.pipe(
  resolver.zod(RegisterSchema),
  resolver.authorize(),
  async ({ email, role }) => {
    const data = {
      email,
      role: role ?? undefined,
    }

    // 1. Création de l'utilisateur (renvoie une erreur si le mail existe déjà)
    const user = await db.user.create({
      data,
    })

    // 2. Création du Token de création de l'utilisateur
    const token = generateToken()
    const hashedToken = hash256(token)
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + REGISTER_USER_TOKEN_EXPIRATION_IN_DAYS)

    // 3. Save token in database
    await db.token.create({
      data: {
        user: { connect: { id: user.id } },
        type: "NEW_USER",
        expiresAt,
        hashedToken,
        sentTo: user.email,
      },
    })

    // 4. Send the email
    await newUserMailer({ to: user.email, token, expiresAt }).send()

    return user
  }
)
