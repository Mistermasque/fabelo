import { Form, FormProps } from "src/app/components/Form"
import Grid from "@mui/material/Unstable_Grid2"
import { z } from "zod"
import { ExpenseWithTotalAmount } from "app/expenses/queries/getExpensesWithTotalAmount"
import { Paper, Stack } from "@mui/material"
import { useCallback, useState } from "react"
import React from "react"
import { Field } from "formik"
import { Balance, calculateBalance } from "app/util/calculateBalance"
import { BalancesDetails } from "./BalancesDetails"
import { CheckboxWithLabel, TextField } from "formik-mui"
import { ExpensesListInput } from "./ExpensesListInput"
import { DatePicker } from "app/components/formik-mui/DatePicker"
export { FORM_ERROR } from "app/components/Form"

interface RefundFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  expenses: ExpenseWithTotalAmount[]
}

export function RefundForm<S extends z.ZodType<any, any>>({
  expenses,
  ...props
}: RefundFormProps<S>) {
  // Convertion des valeurs des ids en string pour la gestion des checkboxes
  // Voir https://github.com/jaredpalmer/formik/issues/2044
  // Non encore implémenté par la pull request https://github.com/jaredpalmer/formik/pull/2255
  if (props.initialValues) {
    props.initialValues.expenseIds = props.initialValues.expenseIds.map((value: number) =>
      String(value)
    )
  }

  const isNew = props.initialValues?.id ? false : true

  const getBalances = useCallback(
    (expenseIds?: string[]) => {
      const filtererExpenses = expenses.filter((expense) => {
        return expenseIds ? expenseIds.indexOf(String(expense.id)) !== -1 : true
      })

      return calculateBalance(filtererExpenses)
    },
    [expenses]
  )

  const [balances, setBalances] = useState<Balance[]>(getBalances(props.initialValues?.expenseIds))

  const handleChange = (expenseIds: string[]) => {
    setBalances(getBalances(expenseIds))
  }

  return (
    <Form<S> {...props}>
      <Stack spacing={2}>
        <Paper sx={{ p: 1 }}>
          <BalancesDetails balances={balances} />
        </Paper>

        <Grid container spacing={1} alignItems="center">
          <Grid xs={6} sm={4} md={3} lg={2}>
            <Field component={DatePicker} name="date" label="Date du remboursement" />
          </Grid>
          <Grid xs={6} sm={4} md={3} lg={2}>
            <Field
              component={CheckboxWithLabel}
              type="checkbox"
              name="isValidated"
              Label={{ label: "Remboursement validé" }}
            />
          </Grid>
          <Grid xs={12} sm>
            <Field
              component={TextField}
              name="comment"
              label="Commentaire"
              placeholder="Commentaire"
              sx={{ width: "100%" }}
              multiline
            />
          </Grid>
        </Grid>
        <ExpensesListInput
          expenses={expenses}
          onChange={(expenseIds) => handleChange(expenseIds)}
          readonly={!isNew}
        />
      </Stack>
    </Form>
  )
}
