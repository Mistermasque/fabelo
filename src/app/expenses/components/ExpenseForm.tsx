import { Field } from "formik"
import React, { useState } from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledSelectField } from "src/app/components/LabeledSelectField"
import { z } from "zod"
import { ExpenseDetailsInputs } from "./ExpenseDetailsInputs"
import { ExpensePartsInputs } from "./ExpensePartsInputs"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "app/users/queries/getUsers"
import LabeledCheckBoxField from "app/components/LabeledCheckBoxField"
import { Chip, Stack } from "@mui/material"
import { TextField } from "formik-mui"

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
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
          <Field component={TextField} label="Titre" name="title" sx={{ flexGrow: 1 }} />
          <LabeledSelectField
            name="userId"
            label="Qui a payé"
            options={users}
            optionAttributeTitle="name"
            optionAttributeValue="id"
          />
        </Stack>
        <ExpenseDetailsInputs onUpdateTotalAmount={handleUpdateDetailAmount} />

        <Chip label={"Montant total : " + totalAmount + " €"} />
        <LabeledCheckBoxField name="isDefaultParts" label="Utiliser la répartition par défaut" />
        <ExpensePartsInputs totalAmount={totalAmount} />
      </Stack>
    </Form>
  )
}
