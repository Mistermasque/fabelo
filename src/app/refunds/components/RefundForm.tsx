import { Form, FormProps } from "src/app/components/Form"
import Grid from "@mui/material/Unstable_Grid2"
import { z } from "zod"
import {
  Box,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Paper,
  Stack,
  styled,
} from "@mui/material"
import { Suspense, useCallback, useState } from "react"
import React from "react"
import { Field } from "formik"
import {
  Balance,
  calculateBalance,
  ExpenseWithPartAndTotalAmount,
} from "@/db/virtual-fields/computeBalances"
import { BalancesDetails } from "./BalancesDetails"
import { CheckboxWithLabel, TextField } from "formik-mui"
import { ExpensesListInput, ExpensesListInputProps } from "./ExpensesListInput"
import { DatePicker } from "app/components/formik-mui/DatePicker"
import { ArrayElement } from "@/src/app/types"
import { ExpenseItem } from "app/expenses/components/ExpenseItem"
import { Expense } from "app/expenses/components/Expense"
import { ChevronRight, InfoOutlined } from "@mui/icons-material"

export { FORM_ERROR } from "app/components/Form"

type Expense = ArrayElement<ExpensesListInputProps["expenses"]> & ExpenseWithPartAndTotalAmount

export interface RefundFormProps<S extends z.ZodType<any, any>> extends FormProps<S> {
  expenses: Expense[]
}

export function RefundForm<S extends z.ZodType<any, any>>({
  expenses,
  ...props
}: RefundFormProps<S>) {
  // Convertion des valeurs des ids en string pour la gestion des checkboxes
  // Voir https://github.com/jaredpalmer/formik/issues/2044
  // Non encore implémenté par la pull request https://github.com/jaredpalmer/formik/pull/2255
  if (props.initialValues && props.initialValues.expenseIds) {
    props.initialValues.expenseIds = props.initialValues.expenseIds.map((value: number) =>
      String(value)
    )
  }

  const [expenseDetailsOpened, setExpenseDetailsOpened] = useState(false)
  const [expenseDetailsId, setExpenseDetailsId] = useState<number | null>(null)

  const toggleExpenseDetailsOpened = (state: boolean) => () => {
    setExpenseDetailsOpened(state)
  }

  const isNew = props.initialValues?.id ? false : true

  const getBalances = useCallback(
    (expenseIds?: string[]) => {
      const filteredExpenses = expenses.filter((expense) => {
        return expenseIds ? expenseIds.indexOf(String(expense.id)) !== -1 : true
      })

      return calculateBalance(filteredExpenses)
    },
    [expenses]
  )

  const [balances, setBalances] = useState<Balance[]>(getBalances(props.initialValues?.expenseIds))

  const handleChange = (expenseIds: string[]) => {
    setBalances(getBalances(expenseIds))
  }

  const handleShowExpenseDetails = (expenseId: number) => {
    setExpenseDetailsId(expenseId)
    setExpenseDetailsOpened(true)
  }

  return (
    <>
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
          {isNew ? (
            <ExpensesListInput
              expenses={expenses}
              onChange={(expenseIds) => handleChange(expenseIds)}
              onShowExpenseDetails={handleShowExpenseDetails}
            />
          ) : (
            <List>
              {expenses.map((expense, index) => {
                return (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="voir dépense"
                        onClick={() => handleShowExpenseDetails(expense.id)}
                      >
                        <InfoOutlined />
                      </IconButton>
                    }
                  >
                    <ExpenseItem expense={expense} />
                  </ListItem>
                )
              })}
            </List>
          )}
        </Stack>
      </Form>
      <Drawer
        anchor="right"
        open={expenseDetailsOpened}
        onClose={toggleExpenseDetailsOpened(false)}
      >
        <DrawerHeader>
          <IconButton onClick={toggleExpenseDetailsOpened(false)}>
            <ChevronRight />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <ExpenseDetails expenseId={expenseDetailsId} />
      </Drawer>
    </>
  )
}

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface ExpenseDetailsProps {
  expenseId: number | null
}

function ExpenseDetails({ expenseId }: ExpenseDetailsProps) {
  if (expenseId === null) {
    return null
  }

  const Fallback = () => {
    return (
      <Box
        display="flex"
        sx={{ height: "100%" }}
        alignItems="center"
        justifyContent="center"
        padding={8}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Suspense fallback={<Fallback />}>
      <Box padding={2}>
        <Expense expenseId={expenseId} />
      </Box>
    </Suspense>
  )
}
