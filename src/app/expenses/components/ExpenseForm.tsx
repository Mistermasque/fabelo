import { FieldArray, useFormikContext } from "formik"
import React, { useState } from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"

import { z } from "zod"
import { Detail, ExpenseDetailsInputs } from "./ExpenseDetailsInputs"
import { ExpensePartsInputs } from "./ExpensePartsInputs"

export { FORM_ERROR } from "src/app/components/Form"

export function ExpenseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [totalAmount, setTotalAmount] = useState(0)

  const handleUpdateDetailAmount = (total: number) => {
    setTotalAmount(total)
  }

  return (
    <Form<S> {...props}>
      <div>{totalAmount}</div>
      <ExpenseDetailsInputs onUpdateTotalAmount={handleUpdateDetailAmount} />
      <ExpensePartsInputs totalAmount={totalAmount} />
    </Form>
  )
}
