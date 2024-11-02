"use client"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { usePageTitle } from "app/hooks/usePageTitle"
import { Divider, IconButton, List, ListItem, ListItemButton } from "@mui/material"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import { ExpensesFilterForm } from "./ExpensesFilterForms"
import { SubMenuDrawerBox } from "app/components/layout/SubMenuDrawerBox"
import { useSearchFilters } from "app/hooks/useSearchFilter"
import getExpenses from "../queries/getExpenses"
import { FilterExpensesInput } from "../schemas"
import { ArrowForward } from "@mui/icons-material"
import Link from "next/link"
import { ExpenseItem } from "./ExpenseItem"

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
    const params = new URLSearchParams(searchparams.toString())
    params.set("page", (page - 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }
  const goToNextPage = () => {
    const params = new URLSearchParams(searchparams.toString())
    params.set("page", (page + 1).toString())
    router.push((pathname + "?" + params.toString()) as Route)
  }

  const handleClickView = (id: number) => {
    router.push(`/expenses/${id}`)
  }

  return (
    <>
      <SubMenuDrawerBox iconButton="Search">
        <ExpensesFilterForm onFilter={handleFilter} initialValues={getFiltersFromURL()} />
      </SubMenuDrawerBox>
      <List>
        {expenses.map((expense) => (
          <>
            <ListItem key={expense.id} disablePadding>
              <ListItemButton onClick={() => handleClickView(expense.id)} sx={{ px: 0 }}>
                <ExpenseItem expense={expense} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </>
  )
}
