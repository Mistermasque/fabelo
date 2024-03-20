import { Box, Button, MenuItem, Stack } from "@mui/material"
import { FORM_ERROR, Form } from "app/components/Form"
import { z } from "zod"
import { FilterExpensesSchema } from "../schemas"
import { Field, useFormikContext } from "formik"
import { Search } from "@mui/icons-material"
import { useQuery } from "@blitzjs/rpc"
import getUsersList from "app/users/queries/getUsersList"
import { SelectWithOptions } from "app/components/formik-mui-date-picker/SelectWithOptions"

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
  const [users, {}] = useQuery(
    getUsersList,
    {},
    {
      staleTime: Infinity,
    }
  )

  const isPaidOpts = [
    {
      title: "Remboursé",
      value: 1,
    },
    {
      title: "Non remboursé",
      value: 0,
    },
  ]

  // Il faut définir des valeurs par défaut à null sinon on a une erreur de perte du contrôle de l'input
  // https://github.com/stackworx/formik-mui/issues/236
  initialValues = {
    ...{ payorId: null, isPaid: null },
    ...initialValues,
  }

  return (
    <Form<typeof FilterExpensesSchema>
      schema={FilterExpensesSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          await onFilter(values)
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    >
      <Stack gap={1} direction={{ sm: "row", xs: "column" }} sx={{ m: 1 }} flexWrap="wrap">
        <Field
          component={SelectWithOptions}
          name="isPaid"
          label="Remboursé"
          options={isPaidOpts}
          empty="Tous"
          formControl={{ sx: { minWidth: 150 } }}
        />
        <Field
          component={SelectWithOptions}
          name="payorId"
          label="Payeur"
          options={users}
          empty="Tous"
          formControl={{ sx: { minWidth: 150 } }}
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
