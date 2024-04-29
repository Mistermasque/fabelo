import getExpense from "app/expenses/queries/getExpense"
import { useQuery } from "@blitzjs/rpc"
import {
  Chip,
  Table,
  TableContainer,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  TableHead,
  Stack,
} from "@mui/material"

export interface ExpenseProps {
  expenseId: number
}

export function Expense({ expenseId }: ExpenseProps) {
  const [expense] = useQuery(getExpense, { id: expenseId })

  return (
    <Stack spacing={1}>
      <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center">
        <Typography component="h2" variant="h4">
          {expense.title}
        </Typography>

        <Chip
          variant="outlined"
          label={expense.totalAmount + " €"}
          color={expense.totalAmount >= 0 ? "error" : "success"}
        />
      </Stack>
      <Typography component="em" variant="body2">
        {"Créée le " +
          expense.createdAt.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }) +
          ", modifiée le " +
          expense.updatedAt.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
      </Typography>
      <Typography variant="body1">
        <strong>{"Payé par : " + expense.user.name}</strong>
      </Typography>
      <Typography component="h3" variant="h5">
        Détails
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expense.details.map((detail, index) => (
              <TableRow hover key={index}>
                <TableCell>{detail.date.toLocaleDateString()}</TableCell>
                <TableCell>{detail.amount + " €"}</TableCell>
                <TableCell>{detail.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography component="h3" variant="h5">
        Parts
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Qui</TableCell>
              <TableCell>Part</TableCell>
              <TableCell>Montant</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expense.parts.map((part, index) => (
              <TableRow hover key={index}>
                <TableCell>{part.user.name}</TableCell>
                <TableCell>{part.part?.toString()}</TableCell>
                <TableCell>{part.amount + " €"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
