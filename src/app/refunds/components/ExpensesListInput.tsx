import {
  Alert,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
  Typography,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import getExpensesWithTotalAmount, {
  ExpenseWithTotalAmount,
} from "app/expenses/queries/getExpensesWithTotalAmount"
import { Field, useFormikContext } from "formik"
import { CreateRefundSchema, UpdateRefundSchema } from "../schemas"
import { z } from "zod"
import { useQuery } from "@blitzjs/rpc"
import { Checkbox } from "formik-mui"

function ExpenseItem({ expense }: { expense: ExpenseWithTotalAmount }) {
  return (
    <Grid container sx={{ width: "100%" }} columnSpacing={{ xs: 2, sm: 1 }}>
      <Grid container columnSpacing={1} xs={9}>
        <Grid>
          <Typography variant="body1" component="h2">
            <strong>{expense.title}</strong>
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {expense.details[0].date.toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography variant="body1" component="em">
            {"Payé par : " + expense.user.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid xs={3} container alignContent="flex-start" justifyContent="flex-end">
        <Chip
          variant="outlined"
          label={expense.totalAmount + " €"}
          color={expense.totalAmount >= 0 ? "error" : "success"}
        />
      </Grid>
    </Grid>
  )
}

export interface ExpensesListInputProps {
  expenses: ExpenseWithTotalAmount[]
  onChange?: (expenseIds: string[]) => void
  readonly?: boolean
}

/**
 * Composant permettant d'afficher la liste des dépenses à ajouter au remboursement
 */
export function ExpensesListInput({ expenses, onChange, readonly }: ExpensesListInputProps) {
  const { values, setFieldValue, errors } = useFormikContext<
    z.infer<typeof CreateRefundSchema> | z.infer<typeof UpdateRefundSchema>
  >()

  const handleToggle = (id: number) => () => {
    const ids = values.expenseIds.map((value) => String(value)) as string[]
    const strId = String(id)
    const currentIndex = ids.indexOf(strId)
    const newIds = [...ids]

    if (currentIndex === -1) {
      newIds.push(strId)
    } else {
      newIds.splice(currentIndex, 1)
    }

    setFieldValue("expenseIds", newIds)
    if (onChange) {
      onChange(newIds)
    }
  }

  const handleSelectAll = () => {
    const ids = expenses.map((expense) => String(expense.id))
    setFieldValue("expenseIds", ids)
    if (onChange) {
      onChange(ids)
    }
  }

  const handleSelectNone = () => {
    setFieldValue("expenseIds", [])
    if (onChange) {
      onChange([])
    }
  }

  if (readonly) {
    return (
      <List>
        {expenses.map((expense, index) => {
          return (
            <ListItem key={index} dense>
              <ExpenseItem expense={expense} />
            </ListItem>
          )
        })}
      </List>
    )
  }

  return (
    <Stack direction="column">
      <Stack direction="row">
        <Button variant="text" onClick={handleSelectAll}>
          Tous
        </Button>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button variant="text" onClick={handleSelectNone}>
          Aucun
        </Button>
      </Stack>
      <List>
        {expenses.map((expense, index) => {
          return (
            <ListItemButton key={index} onClick={handleToggle(expense.id)} dense>
              <ListItemIcon>
                <Field
                  name="expenseIds"
                  value={String(expense.id)}
                  component={Checkbox}
                  tabIndex={-1}
                  disableRipple
                  edge="start"
                  type="checkbox"
                />
              </ListItemIcon>
              <ExpenseItem expense={expense} />
            </ListItemButton>
          )
        })}
      </List>
      {errors.expenseIds ? <Alert severity="error">{errors.expenseIds}</Alert> : null}
    </Stack>
  )
}
