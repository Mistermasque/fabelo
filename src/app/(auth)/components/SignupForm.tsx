"use client"
import { Form, FORM_ERROR } from "src/app/components/Form"
import signup from "../mutations/signup"
import { Signup } from "../validations"
import { useMutation } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { Field } from "formik"
import { TextField } from "formik-mui"
import { Alert, Stack, Typography } from "@mui/material"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup)
  const router = useRouter()

  return (
    <Stack gap={2}>
      <Typography component="h1" variant="h4">
        Fabelo
      </Typography>
      <Typography variant="subtitle2">
        Application de gestion des dépenses entre Fabien et Elodie
      </Typography>
      <Alert severity="warning">
        Vous devez avoir reçu un mail indiquant que vous pouvez créer votre compte pour pouvoir le
        créer.
      </Alert>

      <Form
        submitText="Création du compte"
        schema={Signup}
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            router.refresh()
            router.push("/")
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <Field component={TextField} name="email" label="Email" placeholder="Email" />
        <Field component={TextField} name="name" label="Nom" placeholder="Nom" />
        <Field
          component={TextField}
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
        />
      </Form>
    </Stack>
  )
}
