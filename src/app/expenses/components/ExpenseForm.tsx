import { FieldArray, useFormikContext } from "formik"
import React, { useState } from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledSelectField } from "src/app/components/LabeledSelectField"

import { z } from "zod"
import { Detail, ExpenseDetailsInputs } from "./ExpenseDetailsInputs"
import { ExpensePartsInputs } from "./ExpensePartsInputs"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "../../users/queries/getUsers"
import LabeledCheckBoxField from "../../components/LabeledCheckBoxField"

export { FORM_ERROR } from "src/app/components/Form"

export function ExpenseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [users, {}] = useQuery(
    getUsers,
    { order: "name" },
    {
      staleTime: Infinity,
    }
  )

  const [totalAmount, setTotalAmount] = useState(0)

  const handleUpdateDetailAmount = (total: number) => {
    setTotalAmount(total)
  }

  return (
    <Form<S> {...props}>
      <div>{totalAmount}</div>
      <LabeledSelectField
        name="userId"
        label="Qui a payé"
        options={users}
        optionAttributeTitle="name"
      />
      <ExpenseDetailsInputs onUpdateTotalAmount={handleUpdateDetailAmount} />
      <LabeledCheckBoxField name="isDefaultParts" label="Utiliser la répartition par défaut" />
      <ExpensePartsInputs totalAmount={totalAmount} />
    </Form>
  )
}
