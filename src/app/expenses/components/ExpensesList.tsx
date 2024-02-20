"use client"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getExpenses, { ExpenseWithTotalAmount } from "../queries/getExpenses"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { usePageTitle } from "../../hooks/usePageTitle"
import { Chip, Divider, Grid, Stack, Typography } from "@mui/material"
import { ExpenseItem } from "./ExpenseItem"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import { ExpensesFilterForm } from "./ExpensesFilterForms"

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

  const searchparams = useSearchParams()!
  const page = Number(searchparams.get("page")) || 0
  const [{ expenses, hasMore }, { refetch }] = usePaginatedQuery(getExpenses, {
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
    <>
      <ExpensesFilterForm onFilter={() => {}} initialValues={{}} />
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
