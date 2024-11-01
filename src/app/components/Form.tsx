import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikProps } from "formik"
import { validateZodSchema } from "blitz"
import { z } from "zod"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { fr } from "date-fns/locale/fr"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { Stack } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Save } from "@mui/icons-material"
import { useSnackbar } from "notistack"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  submitIcon?: ReactNode
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.input<S>>["initialValues"]
}

interface OnSubmitResult {
  FORM_ERROR?: string
  [prop: string]: any
}

export const FORM_ERROR = "FORM_ERROR"
export const FORM_SUCCESS = "FORM_SUCCESS"

export function Form<S extends z.ZodType<any, any>>({
  children,
  submitText,
  submitIcon,
  schema,
  initialValues,
  onSubmit,
  ...props
}: FormProps<S>) {
  const [formError, setFormError] = useState<string | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Formik
        initialValues={initialValues || {}}
        validate={validateZodSchema(schema)}
        onSubmit={async (values, { setErrors }) => {
          console.log("Form sent data", values)
          const { FORM_ERROR, FORM_SUCCESS, ...otherErrors } = (await onSubmit(values)) || {}

          if (FORM_ERROR) {
            console.log("FORM_ERROR", FORM_ERROR)
            setFormError(FORM_ERROR)
            enqueueSnackbar(FORM_ERROR, { variant: "error" })
          }

          if (Object.keys(otherErrors).length > 0) {
            console.log("Form errors", otherErrors)
            setErrors(otherErrors)
          }

          if (FORM_SUCCESS) {
            console.log("FORM_SUCCESS", FORM_SUCCESS)
            enqueueSnackbar(FORM_SUCCESS, { variant: "success" })
          }
        }}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <form onSubmit={handleSubmit} className="form" {...props}>
            {children}
            <Stack spacing={2} sx={{ mt: 3 }}>
              {submitText && (
                <Stack direction="row" justifyContent="flex-end">
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                    loading={isSubmitting}
                    loadingPosition="start"
                    startIcon={submitIcon ?? <Save />}
                  >
                    <span>{submitText}</span>
                  </LoadingButton>
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
