import { Chip, Divider, Stack, Typography } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { Decimal } from "@prisma/client/runtime/library"
import { RefundDate, RefundDateProps } from "app/refunds/components/RefundDate"

type ExpenseDetail = {
  amount: number | Decimal
  comment: string | null
  date: Date
}

type Expense = {
  id: number
  totalAmount: number
  title: string
  details: ExpenseDetail[] | null
  user: {
    name: string
  }
  refund?: RefundDateProps["refund"]
}

export interface ExpenseItemProps {
  expense: Expense
}

/**
 * Composant affichant le contenu résumé d'une expense.
 * A utiliser dans une liste
 */
export function ExpenseItem({ expense }: ExpenseItemProps) {
  return (
    <Stack width="100%" gap={0.5}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
        <Typography variant="h6" component="h2" noWrap>
          {expense.title}
        </Typography>
        <Chip
          variant="outlined"
          label={expense.totalAmount + " €"}
          color={expense.totalAmount >= 0 ? "error" : "success"}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body1" component="em">
          {"Payé par : " + expense.user.name}
        </Typography>
        <Typography variant="body1" component="em">
          {expense.details ? expense.details[0].date.toLocaleDateString() : null}
        </Typography>
      </Stack>
      <div>
        <RefundDate refund={expense.refund !== undefined ? expense.refund : undefined} />
      </div>
    </Stack>
  )
}
