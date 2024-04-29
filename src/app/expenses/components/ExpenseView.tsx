"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { usePageTitle } from "app/hooks/usePageTitle"
import getExpense from "../queries/getExpense"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import {
  Button,
  Chip,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { ArrowBack, Delete, Edit, FactCheck } from "@mui/icons-material"
import { RefundDate } from "app/refunds/components/RefundDate"
import Link from "next/link"
import { SubMenu } from "../../components/layout/SubMenu"
import { useConfirm } from "material-ui-confirm"

export interface ExpenseViewProps {
  expenseId: number
}

export function ExpenseView({ expenseId }: ExpenseViewProps) {
  const [expense] = useQuery(
    getExpense,
    { id: expenseId },
    {
      // This ensures the query never refreshes
      staleTime: Infinity,
    }
  )

  const confirm = useConfirm()

  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Dépense #" + expense.id)
  })

  const router = useRouter()
  const [deleteExpenseMutation] = useMutation(deleteExpense)

  const handleClickEdit = () => {
    router.push(`/expenses/${expense.id}/edit`)
  }

  const handleClickDelete = () => {
    confirm({
      title: "Êtes-vous sûr ?",
      description: "Cette action supprimera la dépense sans possibilité de récupération !",
      cancellationText: "Annuler",
      confirmationText: "Oui, supprimer",
      confirmationButtonProps: { color: "error" },
    }).then(async () => {
      await deleteExpenseMutation({ id: expense.id })
      router.push("/expenses")
    })
  }
  const handleGoBackClick = () => {
    if (window.history.length > 0) {
      router.back()
    } else {
      router.push("/expenses")
    }
  }

  return (
    <>
      <SubMenu>
        <MenuItem onClick={handleClickEdit}>
          <ListItemIcon>
            <Edit />
          </ListItemIcon>
          <ListItemText>Editer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClickDelete}>
          <ListItemIcon>
            <Delete />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </SubMenu>
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid container xs={12} alignItems="center">
          <Grid>
            <IconButton size="large" onClick={handleGoBackClick}>
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid flexGrow={1}>
            <Typography component="h2" variant="h4">
              {expense.title}
            </Typography>
          </Grid>
          <Grid>
            <Chip
              variant="outlined"
              label={expense.totalAmount + " €"}
              color={expense.totalAmount >= 0 ? "error" : "success"}
            />
          </Grid>
        </Grid>
        <Grid xs={12}>
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
        </Grid>
        <Grid container alignItems="center" xs={12} columnSpacing={2}>
          <Grid>
            <Typography variant="body1">
              <strong>{"Payé par : " + expense.user.name}</strong>
            </Typography>
          </Grid>
          {expense.refund ? (
            <>
              <Grid>
                <RefundDate refund={expense.refund} />
              </Grid>
              <Grid>
                <Link href={`/refunds/${expense.refund.id}`} passHref>
                  <Button size="small" color="secondary" startIcon={<FactCheck />}>
                    Voir le remboursement
                  </Button>
                </Link>
              </Grid>
            </>
          ) : null}
        </Grid>
        <Grid xs={12}>
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
        </Grid>
        <Grid xs={12}>
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
        </Grid>
      </Grid>
    </>
  )
}
