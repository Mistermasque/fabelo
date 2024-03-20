"use client"
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import getExpenses, { ExpenseWithTotalAmount } from "../queries/getExpenses"
import { useSearchParams } from "next/navigation"
import { usePathname } from "next/navigation"
import { Route } from "next"
import { usePageTitle } from "../../hooks/usePageTitle"
import { Divider, Stack } from "@mui/material"
import { ExpenseItem } from "./ExpenseItem"
import { useEffect } from "react"
import deleteExpense from "../mutations/deleteExpense"
import { ExpensesFilterForm } from "./ExpensesFilterForms"
import { SubMenuDrawerBox } from "../../components/layout/SubMenuDrawerBox"

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

  const handleFilter = async (values: any) => {
    console.log("values", values)
    // try {
    //   const updated = await updateExpenseMutation({
    //     ...values,
    //     id: expense.id,
    //   })
    //   await setQueryData(updated)
    //   router.refresh()
    // } catch (error: any) {
    //   console.error(error)
    //   return {
    //     [FORM_ERROR]: error.toString(),
    //   }
    // }
  }

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
      <SubMenuDrawerBox iconButton="Search">
        <ExpensesFilterForm onFilter={handleFilter} initialValues={{}} />
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
