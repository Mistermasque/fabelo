import { FormControl, FormHelperText, InputLabel, MenuItem } from "@mui/material"
import Select from "@mui/material/Select"
import { fieldToSelect, SelectProps } from "formik-mui"

export interface SelectWithOptionsProps extends SelectProps {
  /** Le texte à afficher pour la valeur vide */
  empty?: string
  /** La liste des options */
  options: { value: string | number | readonly string[]; title: any }[]
}

export function SelectWithOptions({
  formControl,
  inputLabel,
  formHelperText,
  empty,
  options,
  ...selectProps
}: SelectWithOptionsProps) {
  const { error, formError, disabled, ...selectFieldProps } = fieldToSelect(selectProps)
  const { children: formHelperTextChildren, ...formHelperTextProps } = formHelperText || {}
  const shouldDisplayFormHelperText = error || formHelperTextChildren

  if (empty) {
    selectFieldProps.displayEmpty = true
  }

  return (
    <FormControl disabled={disabled} error={error} {...formControl}>
      <InputLabel id={selectFieldProps.labelId} {...inputLabel}>
        {selectFieldProps.label}
      </InputLabel>
      <Select {...selectFieldProps}>
        {empty && (
          <MenuItem value="">
            <em>{empty}</em>
          </MenuItem>
        )}
        {options &&
          options.map((opt, index) => (
            <MenuItem value={opt.value} key={index}>
              {opt.title}
            </MenuItem>
          ))}
      </Select>
      {shouldDisplayFormHelperText && (
        <FormHelperText {...formHelperTextProps}>
          {error ? formError : formHelperTextChildren}
        </FormHelperText>
      )}
    </FormControl>
  )
}

SelectWithOptions.displayName = "FormikMaterialUISelectWithOptions"
