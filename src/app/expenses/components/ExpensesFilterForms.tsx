import { Box, Button, Stack } from "@mui/material"
import { FORM_ERROR, Form } from "app/components/Form"
import { LabeledSelectField } from "app/components/LabeledSelectField"
import { z } from "zod"
import { FilterExpensesSchema } from "../schemas"
import { useFormikContext } from "formik"
import { Search } from "@mui/icons-material"

export { FORM_ERROR } from "app/components/Form"

export interface ExpensesFilterFormProps {
  initialValues: z.infer<typeof FilterExpensesSchema>
  onFilter: (values: z.infer<typeof FilterExpensesSchema>) => void
}

function SubmitButton() {
  const { isSubmitting } = useFormikContext()

  return (
    <Button
      variant="contained"
      type="submit"
      sx={{ width: { xs: "100%", sm: "auto" } }}
      disabled={isSubmitting}
    >
      <Search />
    </Button>
  )
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
      <Stack gap={1} direction={{ sm: "row", xs: "column" }} sx={{ m: 1 }} flexWrap="wrap">
        <LabeledSelectField
          name="isPaid"
          label="Remboursé"
          options={options}
          optionAttributeTitle="name"
          formControlProps={{ sx: { minWidth: 150 } }}
        />
        <LabeledSelectField
          name="userId"
          label="Payeur"
          options={options}
          optionAttributeTitle="name"
          formControlProps={{ sx: { minWidth: 150 } }}
        />
        <LabeledSelectField
          name="tri"
          label="Trier par"
          options={options}
          optionAttributeTitle="name"
          formControlProps={{ sx: { minWidth: 150 } }}
        />
        <Box
          flexGrow="1"
          sx={{ display: "flex", py: 1 }}
          alignItems="center"
          justifyContent="flex-end"
        >
          <SubmitButton />
        </Box>
      </Stack>
    </Form>
  )
}
