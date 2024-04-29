import { Chip, Typography } from "@mui/material"
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
    <Grid container spacing={1} sx={{ width: "100%" }}>
      <Grid container xs={7} sm={10}>
        <Grid>
          <Typography variant="body1" component="h2">
            <strong>
              {expense.details ? expense.details[0].date.toLocaleDateString() + " - " : null}
              {expense.title}
            </strong>
          </Typography>
        </Grid>
        <Grid container alignItems="center" xs={12}>
          <Grid>
            <Typography variant="body1" component="em">
              {"Payé par : " + expense.user.name}
            </Typography>
          </Grid>
          <Grid>
            <RefundDate refund={expense.refund !== undefined ? expense.refund : undefined} />
          </Grid>
        </Grid>
      </Grid>
      <Grid container xs={5} sm={2} justifyContent="flex-end" alignContent="center">
        <Chip
          variant="outlined"
          label={expense.totalAmount + " €"}
          color={expense.totalAmount >= 0 ? "error" : "success"}
        />
      </Grid>
    </Grid>
  )
}
