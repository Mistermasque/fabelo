import {
  Alert,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Stack,
} from "@mui/material"
import { Field, useFormikContext } from "formik"
import { CreateRefundSchema, UpdateRefundSchema } from "../schemas"
import { z } from "zod"
import { Checkbox } from "formik-mui"
import { ExpenseItem, ExpenseItemProps } from "app/expenses/components/ExpenseItem"

export interface ExpensesListInputProps {
  expenses: ExpenseItemProps["expense"][]
  onChange?: (expenseIds: string[]) => void
}

/**
 * Composant permettant d'afficher la liste des dépenses à ajouter au remboursement
 */
export function ExpensesListInput({ expenses, onChange }: ExpensesListInputProps) {
  const { values, setFieldValue, errors } = useFormikContext<z.infer<typeof CreateRefundSchema>>()

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
