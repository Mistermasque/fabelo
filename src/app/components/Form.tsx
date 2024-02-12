import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import "dayjs/locale/fr"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { Button, Box, Stack } from "@mui/material"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.infer<S>>["initialValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
      <Formik
        initialValues={initialValues || {}}
        validate={validateZodSchema(schema)}
        onSubmit={async (values, { setErrors }) => {
          const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}

          if (FORM_ERROR) {
            setFormError(FORM_ERROR)
          }

          if (Object.keys(otherErrors).length > 0) {
            setErrors(otherErrors)
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="form" {...props}>
            {/* Form fields supplied as children are rendered here */}
            {children}

            <Stack spacing={2} sx={{ mt: 3 }}>
              {formError && (
                <div role="alert" style={{ color: "red" }}>
                  {formError}
                </div>
              )}

              {submitText && (
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    type="submit"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                    disabled={isSubmitting}
                  >
                    {submitText}
                  </Button>
                </Stack>
              )}
            </Stack>
          </form>
        )}
      </Formik>
    </LocalizationProvider>
  )
}

export default Form
