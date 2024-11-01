"use client"
import createUser from "@/src/app/(auth)/mutations/register"
import { useMutation } from "@blitzjs/rpc"
import { Stack } from "@mui/material"
import { Form, FORM_ERROR, FORM_SUCCESS } from "app/components/Form"
import { RegisterSchema } from "app/(auth)/schemas"
import { Field } from "formik"
import { SelectWithOptions } from "app/components/formik-mui/SelectWithOptions"
import { TextField } from "formik-mui"
import { useRouter } from "next/navigation"
import { usePageTitle } from "app/hooks/usePageTitle"
import { useEffect } from "react"
import { PersonAddAlt } from "@mui/icons-material"

/**
 * Formulaire de création d'un nouvel utilisateur
 */
export function NewUser() {
  const [createUserMutation] = useMutation(createUser)
  const router = useRouter()
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Nouvel utilisateur")
  })
  const roleOpts = [
    {
      title: "Administrateur",
      value: "ADMIN",
    },
    {
      title: "Utilisateur",
      value: "USER",
    },
  ]

  return (
    <Form
      submitText="Créer l'utilisateur"
      submitIcon={<PersonAddAlt />}
      schema={RegisterSchema}
      initialValues={{ email: "" }}
      onSubmit={async (values) => {
        try {
          await createUserMutation(values)
          router.push("/users")
          return {
            [FORM_SUCCESS]:
              "Un mail a été envoyé au destinataire contenant toutes les instructions pour activer son compte",
          }
        } catch (error: any) {
          console.error(error)
          if (error.code === "P2002" && error.meta?.target?.includes("email")) {
            // This error comes from Prisma
            return { email: "Cette adresse mail est déjà utilisée" }
          }
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    >
      <Stack>
        <Field component={TextField} name="email" label="E-mail" />
        <Field component={TextField} name="name" label="Nom" />
        <Field component={SelectWithOptions} name="role" label="Rôle" options={roleOpts} />
      </Stack>
    </Form>
  )
}
