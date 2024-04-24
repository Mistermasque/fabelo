"use client"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { usePageTitle } from "app/hooks/usePageTitle"
import { Chip, IconButton, Typography, List, ListItem, styled } from "@mui/material"
import Grid from "@mui/material/Unstable_Grid2"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import { ExpensesFilterForm } from "./ExpensesFilterForms"
import { SubMenuDrawerBox } from "app/components/layout/SubMenuDrawerBox"
import { useSearchFilters } from "app/hooks/useSearchFilter"
import getExpenses from "../queries/getExpenses"
import { FilterExpensesInput } from "../schemas"
import { Decimal } from "@prisma/client/runtime/library"
import { RefundDate, RefundDateProps } from "app/refunds/components/RefundDate"
import { ArrowForward } from "@mui/icons-material"
import Link from "next/link"

const ITEMS_PER_PAGE = 100

export function ExpensesList() {
  const { setPageTitle } = usePageTitle()

  const [deleteExpenseMutation] = useMutation(deleteExpense)

  useEffect(() => {
    setPageTitle("Liste des dépenses")
  })

  const handleDeleteExpense = async (id: number) => {
    await deleteExpenseMutation({ id })
    refetch()
  }

  const handleFilter = async (values: FilterExpensesInput) => {
    const params = mergeURLParams(values)
    router.push((pathname + "?" + params.toString()) as Route)
  }

  const searchparams = useSearchParams()!
  const { mergeURLParams, getFiltersFromURL, getOrderByFromURL } =
    useSearchFilters<FilterExpensesInput>(
      { payorId: "", isPaid: "", dateMin: null, dateMax: null, title: "" },
      { title: "asc" }
    )

  const page = Number(searchparams.get("page")) || 0
  const orderBy = getOrderByFromURL()
  const [{ expenses, hasMore }, { refetch }] = usePaginatedQuery(getExpenses, {
    orderBy: orderBy ?? undefined,
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    filter: getFiltersFromURL(["payorId", "isPaid", "dateMin", "dateMax", "title"]),
    includeRefund: true,
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
    <>
      <SubMenuDrawerBox iconButton="Search">
        <ExpensesFilterForm onFilter={handleFilter} initialValues={getFiltersFromURL()} />
      </SubMenuDrawerBox>
      <List>
        {expenses.map((expense) => (
          <ExpenseListItem key={expense.id} expense={expense} />
        ))}
      </List>
    </>
  )
}

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

interface ExpenseListItemProps {
  expense: Expense
}

function ExpenseListItem({ expense }: ExpenseListItemProps) {
  return (
    <ListItem
      sx={{
        "&:hover": {
          backgroundColor: (theme) => theme.palette.action.hover,
        },
      }}
    >
      <Grid container spacing={1} sx={{ width: "100%" }}>
        <Grid container xs={6} sm={9}>
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
        <Grid
          container
          spacing={0}
          xs={6}
          sm={3}
          direction="row"
          alignItems="center"
          alignContent="space-between"
          justifyContent="flex-end"
        >
          <Grid>
            <Chip
              variant="outlined"
              label={expense.totalAmount + " €"}
              color={expense.totalAmount >= 0 ? "error" : "success"}
            />
          </Grid>
          <Grid>
            <Link href={`/expenses/${expense.id}`} passHref>
              <IconButton>
                <ArrowForward />
              </IconButton>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </ListItem>
  )
}
