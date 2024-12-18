/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */

type ResetPasswordMailer = {
  to: string
  token: string
}

export function forgotPasswordMailer({ to, token }: ResetPasswordMailer) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const resetUrl = `${origin}/reset-password?token=${token}`

  const msg = {
    from: process.env.MAIL_FROM,
    to,
    subject: "FabElo - Réinitialisation de votre mot de passe",
    html: `
      <h1>Réinitialisation de votre mot de passe</h1>
      <h3>NOTE: You must set up a production email integration in mailers/forgotPasswordMailer.ts</h3>

      <p>
        Cliquer sur le lien ci-dessous (ou copier-coller le lien dans votre navigateur) pour réinitialiser votre mot de passe :
        <br>
        <a href="${resetUrl}">
          ${resetUrl}
        </a>
      </p>
      <p>
        <em>Ceci est un e-mail automatique, merci de ne pas y répondre</em>
      </p>
    `,
  }

  return {
    async send() {
      if (process.env.NODE_ENV === "production") {
        // TODO - send the production email, like this:
        // await postmark.sendEmail(msg)
        throw new Error("No production email implementation in mailers/forgotPasswordMailer")
      } else {
        // Preview email in the browser
        const previewEmail = (await import("preview-email")).default
        await previewEmail(msg)
      }
    },
  }
}
