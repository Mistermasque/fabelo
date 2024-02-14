"use client"
import { usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getExpenses, { ExpenseWithTotalAmount } from "../queries/getExpenses"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { usePageTitle } from "../../hooks/usePageTitle"
import { Chip, Divider, Grid, Stack, Typography } from "@mui/material"

const ITEMS_PER_PAGE = 100

export const ExpensesList = () => {
  const { setPageTitle } = usePageTitle()

  setPageTitle("Liste des dépenses")

  const searchparams = useSearchParams()!
  const page = Number(searchparams.get("page")) || 0
  const [{ expenses, hasMore }] = usePaginatedQuery(getExpenses, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const router = useRouter()
  const pathname = usePathname()

  const goToPreviousPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }
  const goToNextPage = () => {
    const params = new URLSearchParams(searchparams)
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

  return (
    <Stack divider={<Divider flexItem />} spacing={2}>
      {expenses.map((expense: ExpenseWithTotalAmount) => (
        <Grid container key={expense.id} columns={2}>
          <Grid item sm={1} xs={2}>
            <Typography variant="h6" component="h2">
              {expense.title}
            </Typography>
          </Grid>
          <Grid item sm={1} xs={2}>
            <Typography variant="h3">{"Montant : " + expense.totalAmount + " €"}</Typography>
          </Grid>
          <Grid item sm={1} xs={2}>
            <Typography variant="h4">{"Payé par : " + expense.user.name}</Typography>
          </Grid>
          <Grid item sm={1} xs={2}>
            {expense.refund ? <Chip label={"Remboursé le : " + expense.refund.createdAt} /> : null}
          </Grid>
        </Grid>
      ))}
    </Stack>
  )
}
