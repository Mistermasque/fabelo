import { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"

export interface LabeledCheckBoxFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
}

export const LabeledCheckBoxField = forwardRef<HTMLInputElement, LabeledCheckBoxFieldProps>(
  ({ name, label, outerProps, labelProps, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        <label {...labelProps}>
          {label}
          <input
            {...input}
            checked={input.value}
            // onChange={() => {
            //   const set = new Set(input.value)
            //   if (set.has(props.value)) {
            //     set.delete(props.value)
            //   } else {
            //     set.add(props.value)
            //   }
            //   field.onChange(field.name)(Array.from(set))
            //   form.setFieldTouched(field.name, true)
            // }}
            disabled={isSubmitting}
            type="checkbox"
            {...props}
            ref={ref}
          />
        </label>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" style={{ color: "red" }}>
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

LabeledCheckBoxField.displayName = "LabeledCheckBoxField"

export default LabeledCheckBoxField
