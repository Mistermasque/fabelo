"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { ForgotPasswordSchema } from "../schemas"
import forgotPassword from "../mutations/forgotPassword"
import { useMutation } from "@blitzjs/rpc"
import { Field } from "formik"
import { TextField } from "formik-mui"
import { Alert, Stack, Typography } from "@mui/material"
import { Send } from "@mui/icons-material"
import Link from "next/link"

export function ForgotPassword() {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  if (isSuccess) {
    return (
      <Alert severity="info">
        Si votre mail est connu dans notre base de donnée, un mail contenant les instruction vous a
        été envoyé. Si vous n&apos;avez rien reçu, assurez-vous que votre compte est bien actif ou
        tentez <Link href="/reset-activation">le renvoi du mail d&apos;initialisation</Link>. Sinon,
        contacter votre administrateur.
      </Alert>
    )
  }

  return (
    <Stack gap={2}>
      <Typography component="h1" variant="h4">
        Fabelo
      </Typography>
      <Typography variant="subtitle2">Mot de passe oublié</Typography>
      <Form
        submitText="Recevoir mail de réinitialisation"
        submitIcon={<Send />}
        schema={ForgotPasswordSchema}
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          try {
            await forgotPasswordMutation(values)
          } catch (error: any) {
            return {
              [FORM_ERROR]: "Une erreur s'est produite. Merci de réessayer.",
            }
          }
        }}
      >
        <Stack gap={2}>
          <Field component={TextField} label="Email" name="email" placeholder="Email" />
        </Stack>
      </Form>
    </Stack>
  )
}
