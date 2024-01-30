import { FieldArray, useFormikContext } from "formik"
import React from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"

import { z } from "zod"
import { Detail, ExpenseDetailsInputs } from "./ExpenseDetailsInputs"

export { FORM_ERROR } from "src/app/components/Form"

export function ExpenseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const handleRemoveDetail = (detail: Detail) => {}

  const handleUpdateDetailAmount = (detail: Detail, newAmont: number) => {}

  return (
    <Form<S> {...props}>
      <ExpenseDetailsInputs
        onRemove={handleRemoveDetail}
        onUpdateAmount={handleUpdateDetailAmount}
      />
      <ExpensePartsInputs />
    </Form>
  )
}
