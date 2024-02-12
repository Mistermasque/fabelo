import {
  ChangeEvent,
  FocusEvent,
  ComponentPropsWithoutRef,
  forwardRef,
  PropsWithoutRef,
} from "react"
import { useField, useFormikContext } from "formik"
import { Checkbox, CheckboxProps, FormControlLabel, FormControlLabelProps } from "@mui/material"

export interface LabeledCheckBoxFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  labelProps?: Omit<FormControlLabelProps, "control">

  onChange?: (e: ChangeEvent<any>) => void
  onBlur?: (e: FocusEvent<any, Element>) => void
}

export const LabeledCheckBoxField = forwardRef<HTMLButtonElement, LabeledCheckBoxFieldProps>(
  ({ name, label, labelProps, onChange, onBlur, ...props }, ref) => {
    const [input] = useField({ name })
    const { isSubmitting, handleBlur, handleChange } = useFormikContext()

    const onChangeInput = onChange ? onChange : handleChange
    const onBlurInput = onBlur ? onBlur : handleBlur

    return (
      <FormControlLabel
        label={label}
        {...labelProps}
        control={
          <Checkbox
            ref={ref}
            {...input}
            {...(props as CheckboxProps)}
            disabled={isSubmitting}
            checked={input.value}
            onChange={onChangeInput}
            onBlur={onBlurInput}
          />
        }
      />
    )
  }
)

LabeledCheckBoxField.displayName = "LabeledCheckBoxField"

export default LabeledCheckBoxField
