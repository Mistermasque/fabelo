import { Stack } from "@mui/material"
import Form, { FormProps } from "app/components/Form"
import { Field } from "formik"
import { SelectWithOptions } from "../../components/formik-mui/SelectWithOptions"
import { z } from "zod"

export { FORM_ERROR } from "app/components/Form"

/**
 * Formulaire d'édition d'un utilisateur
 */
export function UserForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
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
    <Form<S> {...props}>
      <Stack>
        <Field component={SelectWithOptions} name="role" label="Rôle" options={roleOpts} />
      </Stack>
    </Form>
  )
}
