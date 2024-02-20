import { Stack } from "@mui/material"
import { FORM_ERROR, Form, FormProps } from "app/components/Form"
import { LabeledSelectField } from "app/components/LabeledSelectField"
import { z } from "zod"
import { FilterExpensesSchema } from "../schemas"

export { FORM_ERROR } from "src/app/components/Form"

export interface ExpensesFilterFormProps {
  initialValues: z.infer<typeof FilterExpensesSchema>
  onFilter: (values: z.infer<typeof FilterExpensesSchema>) => void
}

export function ExpensesFilterForm({ initialValues, onFilter }: ExpensesFilterFormProps) {
  const options = [
    {
      name: "toto",
      id: 1,
    },
    {
      name: "titi",
      id: 2,
    },
  ]

  return (
    <Form<typeof FilterExpensesSchema>
      submitText="Filtrer"
      schema={FilterExpensesSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          onFilter(values)
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    >
      <Stack spacing={1} direction="row">
        <LabeledSelectField
          name="isPaid"
          label="Remboursé"
          options={options}
          optionAttributeTitle="name"
        />
        <LabeledSelectField
          name="userId"
          label="Payeur"
          options={options}
          optionAttributeTitle="name"
        />
        <LabeledSelectField
          name="tri"
          label="Trier par"
          options={options}
          optionAttributeTitle="name"
        />
      </Stack>
    </Form>
  )
}
