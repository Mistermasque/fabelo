import db from "db"
import { ResetActivationSchema } from "../schemas"
import { resolver } from "@blitzjs/rpc"
import { generateToken, hash256 } from "@blitzjs/auth"
import { newUserMailer } from "mailers/newUserMailer"

const RESET_USER_TOKEN_EXPIRATION_IN_HOURS = 2

export class ResetActivationError extends Error {
  name = "ResetActivationError"
  message = "Le compte est invalide"
}

export default resolver.pipe(resolver.zod(ResetActivationSchema), async ({ email }) => {
  // 1. Get the user
  const user = await db.user.findFirst({
    where: { email: email.toLowerCase(), status: "NOT_ACTIVATED" },
  })

  // 2. Generate the token and expiration date.
  const token = generateToken()
  const hashedToken = hash256(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + RESET_USER_TOKEN_EXPIRATION_IN_HOURS)

  // 3. If user with this email was found
  if (user) {
    // 4. Delete any existing password reset tokens
    await db.token.deleteMany({ where: { type: "NEW_USER", userId: user.id } })
    // 5. Save this new token in the database.
    await db.token.create({
      data: {
        user: { connect: { id: user.id } },
        type: "NEW_USER",
        expiresAt,
        hashedToken,
        sentTo: user.email,
      },
    })
    // 6. Send the email
    await newUserMailer({ to: user.email, token, expiresAt }).send()
  } else {
    // 7. If no user found wait the same time so attackers can't tell the difference
    await new Promise((resolve) => setTimeout(resolve, 750))
  }

  // 8. Return the same result whether a password reset email was sent or not
  return
})
