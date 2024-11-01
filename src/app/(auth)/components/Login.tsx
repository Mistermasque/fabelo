"use client"
import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { Form, FORM_ERROR } from "src/app/components/Form"
import login from "../mutations/login"
import { LoginSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import type { Route } from "next"
import { Field } from "formik"
import { TextField } from "formik-mui"
import { Alert, Button, Stack, Typography } from "@mui/material"

type LoginProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const Login = (props: LoginProps) => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()
  const next = useSearchParams()?.get("next")
  return (
    <Stack gap={2}>
      <Typography component="h1" variant="h4">
        Fabelo
      </Typography>
      <Typography variant="subtitle2">
        Application de gestion des dépenses entre Fabien et Elodie
      </Typography>
      <Alert severity="info">Pour accéder à l&apos;application, veuillez vous connecter</Alert>

      <Form
        submitText="Connexion"
        schema={LoginSchema}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await loginMutation(values)
            router.refresh()
            if (next) {
              router.push(next as Route)
            } else {
              router.push("/")
            }
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "E-mail ou mot de passe invalide." }
            } else {
              return {
                [FORM_ERROR]:
                  "Désolé, une erreur inattendue s'est produite. Merci de réessayer. - " +
                  error.toString(),
              }
            }
          }
        }}
      >
        <Stack gap={2}>
          <Field component={TextField} name="email" label="Email" placeholder="Email" />
          <Field
            component={TextField}
            name="password"
            label="Password"
            placeholder="Password"
            type="password"
          />

          <Stack gap={2} direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
            <Link href="/forgot-password" passHref>
              <Button>Mot de passe oublié</Button>
            </Link>

            <Link href="/reset-activation" passHref>
              <Button color="secondary">1ère connexion</Button>
            </Link>
          </Stack>
        </Stack>
      </Form>
    </Stack>
  )
}
