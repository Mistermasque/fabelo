import { useState, ReactNode, PropsWithoutRef } from "react"
import { Formik, FormikErrors, FormikProps } from "formik"
import { formatZodError, validateZodSchema } from "blitz"
import { z, ZodError } from "zod"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { fr } from "date-fns/locale/fr"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { Stack, Alert } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Save } from "@mui/icons-material"
import { useSnackbar } from "notistack"

export interface FormProps<S extends z.ZodType<any, any>>
  extends Omit<PropsWithoutRef<JSX.IntrinsicElements["form"]>, "onSubmit"> {
  /** All your form fields */
  children?: ReactNode
  /** Text to display in the submit button */
  submitText?: string
  schema?: S
  onSubmit: (values: z.infer<S>) => Promise<void | OnSubmitResult>
  initialValues?: FormikProps<z.input<S>>["initialValues"]
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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Formik
        initialValues={initialValues || {}}
        validate={validateZodSchema(schema)}
        onSubmit={async (values, { setErrors }) => {
          console.log("Form sent data", values)
          const { FORM_ERROR, ...otherErrors } = (await onSubmit(values)) || {}

          if (FORM_ERROR) {
            console.log("FORM_ERROR", FORM_ERROR)
            setFormError(FORM_ERROR)
          }

          if (Object.keys(otherErrors).length > 0) {
            console.log("Form errors", otherErrors)
            setErrors(otherErrors)
          }
        }}
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <form onSubmit={handleSubmit} className="form" {...props}>
            {children}
            <Stack spacing={2} sx={{ mt: 3 }}>
              <FormErrors validationErrors={errors} formError={formError} />
              {submitText && (
                <Stack direction="row" justifyContent="flex-end">
                  <LoadingButton
                    variant="contained"
                    type="submit"
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                    loading={isSubmitting}
                    loadingPosition="start"
                    startIcon={<Save />}
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

interface FormErrorsProps {
  formError: string | null
  validationErrors: FormikErrors<any>
}

function FormErrors({ formError, validationErrors }: FormErrorsProps) {
  if (validationErrors && JSON.stringify(validationErrors) !== "{}") {
    console.log("Form validation errors", JSON.stringify(validationErrors))
  }

  const { enqueueSnackbar } = useSnackbar()

  if (formError) {
    enqueueSnackbar(formError, { variant: "error" })
  }

  return null
}

export default Form
