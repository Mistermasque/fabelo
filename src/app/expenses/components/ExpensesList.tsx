"use client"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { usePageTitle } from "app/hooks/usePageTitle"
import { Divider, Stack } from "@mui/material"
import { ExpenseItem } from "./ExpenseItem"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import { ExpensesFilterForm } from "./ExpensesFilterForms"
import { SubMenuDrawerBox } from "app/components/layout/SubMenuDrawerBox"
import { useSearchFilters } from "app/hooks/useSearchFilter"
import getExpenses, {
  ExpenseWithTotalAmount,
  FilterExpensesWithTotalAmountType,
} from "../queries/getExpensesWithTotalAmount"

const ITEMS_PER_PAGE = 100

export const ExpensesList = () => {
  const { setPageTitle } = usePageTitle()

  const [deleteExpenseMutation] = useMutation(deleteExpense)

  useEffect(() => {
    setPageTitle("Liste des dépenses")
  })

  const handleDeleteExpense = async (id: number) => {
    await deleteExpenseMutation({ id })
    refetch()
  }

  const handleEditExpense = (id: number) => {}

  const handleFilter = async (values: FilterExpensesWithTotalAmountType) => {
    const params = mergeURLParams(values)
    router.push((pathname + "?" + params.toString()) as Route)
  }

  const searchparams = useSearchParams()!
  const { mergeURLParams, getFiltersFromURL, getOrderByFromURL } =
    useSearchFilters<FilterExpensesWithTotalAmountType>(
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
      <Stack divider={<Divider flexItem variant="fullWidth" />} spacing={2}>
        {expenses.map((expense: ExpenseWithTotalAmount) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onDelete={handleDeleteExpense}
            onEdit={handleEditExpense}
          />
        ))}
      </Stack>
    </>
  )
}
