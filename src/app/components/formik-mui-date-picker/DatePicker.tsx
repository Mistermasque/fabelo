import {
  DatePicker as MuiDatePicker,
  DatePickerProps as MuiDatePickerProps,
} from "@mui/x-date-pickers/DatePicker"
import { TextFieldProps } from "@mui/material/TextField"
import { FieldProps, getIn } from "formik"
import * as React from "react"
import { createErrorHandler } from "./errorHandler"

export interface DatePickerProps
  extends FieldProps,
    Omit<MuiDatePickerProps<Date>, "name" | "value" | "error"> {
  slotProps?: { textField?: TextFieldProps }
}

/**
 * Modification de formik-mui-date-picker pour fonctionner avec mui datepicker v6
 * https://github.com/stackworx/formik-mui/blob/main/packages/formik-mui-x-date-pickers/src/DatePicker.tsx
 */
export function fieldToDatePicker({
  field: { onChange: _onChange, ...field },
  form: { isSubmitting, touched, errors, setFieldValue, setFieldError, setFieldTouched },
  slotProps: { textField, ...otherSlotProps } = {
    textField: { helperText: undefined, onBlur: undefined },
  },
  disabled,
  onChange,
  onError,
  ...props
}: DatePickerProps): MuiDatePickerProps<Date> {
  const fieldError = getIn(errors, field.name)
  const showError = getIn(touched, field.name) && !!fieldError
  const { helperText, onBlur, ...textFieldProps } = textField
    ? textField
    : { helperText: undefined, onBlur: undefined }

  return {
    slotProps: {
      textField: {
        helperText: showError ? fieldError : helperText,
        onBlur:
          onBlur ??
          function () {
            setFieldTouched(field.name, true, true)
          },
        error: showError,
        ...textFieldProps,
      },
      ...otherSlotProps,
    },
    disabled: disabled ?? isSubmitting,
    onChange:
      onChange ??
      function (date) {
        // Do not switch this order, otherwise you might cause a race condition
        // See https://github.com/formium/formik/issues/2083#issuecomment-884831583
        setFieldTouched(field.name, true, false)
        setFieldValue(field.name, date, true)
      },
    onError: onError ?? createErrorHandler(fieldError, field.name, setFieldError),
    ...field,
    ...props,
  }
}

export function DatePicker({ ...props }: DatePickerProps) {
  return <MuiDatePicker {...fieldToDatePicker(props)} />
}

DatePicker.displayName = "FormikMUIDatePicker"
