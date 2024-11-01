import { formatDistanceToNowStrict } from "date-fns"
import { fr as frLocale } from "date-fns/locale/fr"
/* TODO - You need to add a mailer integration in `integrations/` and import here.
 *
 * The integration file can be very simple. Instantiate the email client
 * and then export it. That way you can import here and anywhere else
 * and use it straight away.
 */

type NewUserMailerInput = {
  to: string
  token: string
  expiresAt: Date
}

export function newUserMailer({ to, token, expiresAt }: NewUserMailerInput) {
  // In production, set APP_ORIGIN to your production server origin
  const origin = process.env.APP_ORIGIN || process.env.BLITZ_DEV_SERVER_ORIGIN
  const activateUrl = `${origin}/activate?token=${token}`
  const expirationDelay = formatDistanceToNowStrict(expiresAt, { locale: frLocale })

  const msg = {
    from: process.env.MAIL_FROM,
    to,
    subject: "FabElo - Création de votre compte",
    html: `
      <h1>Votre compte viens d'être créé pour l'application FabElo</h1>
      <h3>NOTE: You must set up a production email integration in mailers/newUserdMailer.ts</h3>

      <p>
        Cliquer sur le lien ci-dessous (ou copier-coller le lien dans votre navigateur) pour activer votre compte :
        <br>
        <a href="${activateUrl}">
          ${activateUrl}
        </a>
      </p>
      <p>
        <strong>Attention, vous devez impérativement activer votre compte dans moins de ${expirationDelay} !</strong>
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
        throw new Error("No production email implementation in mailers/newUserdMailer")
      } else {
        // Preview email in the browser
        const previewEmail = (await import("preview-email")).default
        await previewEmail(msg)
      }
    },
  }
}
