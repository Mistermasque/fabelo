"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { ResetPasswordSchema } from "../schemas"
import resetPassword from "../mutations/resetPassword"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Alert, Stack, Typography } from "@mui/material"
import { Field } from "formik"
import { TextField } from "formik-mui"

export function ResetPassword() {
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")?.toString()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)
  const router = useRouter()

  if (!token) {
    return (
      <Alert severity="error">
        Vous devez passer par le lien reçu par mail pour activer réinitialiser votre mot de passe.
      </Alert>
    )
  }

  return (
    <Stack gap={2}>
      <Typography component="h1" variant="h4">
        Fabelo
      </Typography>
      <Typography variant="subtitle2">Changer le mot de passe</Typography>
      <Form
        submitText="Changer le mot de passe"
        schema={ResetPasswordSchema}
        initialValues={{ password: "", confirmPassword: "", token }}
        onSubmit={async (values) => {
          try {
            await resetPasswordMutation({ ...values, token })
            router.refresh()
            router.push("/")
          } catch (error: any) {
            if (error.name === "ResetPasswordError") {
              return {
                [FORM_ERROR]: error.message,
              }
            }
            return {
              [FORM_ERROR]: "Une erreur s'est produite. Merci de réessayer.",
            }
          }
        }}
      >
        <Stack gap={2}>
          <Field
            component={TextField}
            name="password"
            label="Mot de passe"
            placeholder="Mot de passe"
            type="password"
          />
          <Alert severity="info">
            Le mot de passe doit contenir au moins 10 caractères avec majuscules, minuscule, chiffre
            et caractère spéciaux.
          </Alert>
          <Field
            component={TextField}
            name="confirmPassword"
            label="Confirmation"
            placeholder="Re-saisir le mot de passe"
            type="password"
          />
        </Stack>
      </Form>
    </Stack>
  )
}
