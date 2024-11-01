"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import activate from "../mutations/activate"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Field } from "formik"
import { TextField } from "formik-mui"
import { Alert, Stack, Typography } from "@mui/material"
import { ActivateSchema } from "../schemas"
import { PermIdentity } from "@mui/icons-material"
import { useSearchParams } from "next/navigation"

type ActivateProps = {
  onSuccess?: () => void
}

export const Activate = (props: ActivateProps) => {
  const [activateMutation] = useMutation(activate)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams?.get("token")?.toString()

  if (!token) {
    return (
      <Alert severity="error">
        Vous devez passer par le lien reçu par mail pour activer votre compte.
      </Alert>
    )
  }

  return (
    <Stack gap={2}>
      <Typography component="h1" variant="h4">
        Fabelo
      </Typography>
      <Typography variant="subtitle2">Activer votre compte</Typography>
      <Form
        submitText="Activation du compte"
        submitIcon={<PermIdentity />}
        schema={ActivateSchema}
        initialValues={{ password: "", confirmPassword: "", name: "", token }}
        onSubmit={async (values) => {
          try {
            await activateMutation({ ...values, token })
            router.refresh()
            router.push("/")
          } catch (error: any) {
            if (error.name === "ActivateError") {
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
          <Field component={TextField} name="name" label="Nom" placeholder="Votre nom" />
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
