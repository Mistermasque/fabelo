import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext } from "formik"
import {
  FormControl,
  FormControlProps,
  FormHelperText,
  InputLabel,
  InputLabelProps,
  MenuItem,
  Select,
} from "@mui/material"

export interface LabeledSelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  options: { id: number; [key: string]: any }[]
  /** Le nom de l'attribut dans les options à utiliser pour le titre */
  optionAttributeTitle: string
  formControlProps?: FormControlProps
  labelProps?: InputLabelProps
  id?: string
  helperText?: string
}

export const LabeledSelectField = forwardRef<HTMLSelectElement, LabeledSelectFieldProps>(
  (
    {
      label,
      formControlProps,
      labelProps,
      name,
      options,
      optionAttributeTitle,
      id,
      helperText,
      ...props
    },
    ref
  ) => {
    const [input, meta] = useField(name)
    const { isSubmitting, handleBlur, handleChange } = useFormikContext()
    const inputId = id ? id : Math.random().toString(16).slice(2)
    const labelId = id + "-label"
    const formHelperText = meta.touched && meta.error ? meta.error : helperText
    return (
      <FormControl {...formControlProps}>
        <InputLabel id={labelId} {...labelProps}>
          {label}
        </InputLabel>
        <Select
          labelId={labelId}
          id={inputId}
          label={label}
          disabled={isSubmitting}
          {...input}
          ref={ref}
          onChange={handleChange}
          onBlur={handleBlur}
          error={meta.touched && Boolean(meta.error)}
        >
          {options &&
            options.map((value) => (
              <MenuItem value={value.id} key={value.id}>
                {value[optionAttributeTitle]}
              </MenuItem>
            ))}
        </Select>
        {formHelperText ? <FormHelperText>{formHelperText}</FormHelperText> : null}
      </FormControl>
    )
  }
)

LabeledSelectField.displayName = "LabeledSelectField"

export default LabeledSelectField
