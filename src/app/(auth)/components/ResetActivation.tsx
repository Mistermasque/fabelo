"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import { ResetActivationSchema } from "../schemas"
import resetActivation from "../mutations/resetActivation"
import { useMutation } from "@blitzjs/rpc"
import { Field } from "formik"
import { TextField } from "formik-mui"
import { Alert, Stack, Typography } from "@mui/material"
import { Send } from "@mui/icons-material"
import Link from "next/link"

export function ResetActivation() {
  const [resetActivationMutation, { isSuccess }] = useMutation(resetActivation)

  if (isSuccess) {
    return (
      <Alert severity="info">
        Si votre mail est connu dans notre base de donnée, un mail contenant les instruction vous a
        été envoyé. Si vous n&apos;avez rien reçu, assurez-vous que votre compte n&apos;a pas été
        activé ou tentez <Link href="/forgot-password">le mot de passe oublié</Link>.
      </Alert>
    )
  }

  return (
    <Stack gap={2}>
      <Typography component="h1" variant="h4">
        Fabelo
      </Typography>
      <Typography variant="subtitle2">Activer son compte</Typography>
      <Alert severity="warning">
        Vous devez avoir reçu un mail de création de votre compte. Ce formulaire vous permet de
        redemander le mail d&apos;activation
      </Alert>
      <Form
        submitText="Recevoir mail de réinitialisation"
        submitIcon={<Send />}
        schema={ResetActivationSchema}
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          try {
            await resetActivationMutation(values)
          } catch (error: any) {
            if (error.name === "ResetActivationError") {
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
          <Field component={TextField} label="Email" name="email" placeholder="Email" />
        </Stack>
      </Form>
    </Stack>
  )
}
