"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { usePageTitle } from "app/hooks/usePageTitle"
import getExpense from "../queries/getExpense"
import { useEffect } from "react"
import { ExpenseItem } from "./ExpenseItem"
import deleteExpense from "../mutations/deleteExpense"

export interface ExpenseProps {
  expenseId: number
}

export function Expense({ expenseId }: ExpenseProps) {
  const [expense] = useQuery(
    getExpense,
    { id: expenseId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  const { setPageTitle } = usePageTitle()
  useEffect(() => {
    setPageTitle("Liste des dépenses")
  })

  const router = useRouter()
  const [deleteExpenseMutation] = useMutation(deleteExpense)
  const handleDeleteExpense = async (id: number) => {
    await deleteExpenseMutation({ id })
    router.push("/expenses")
  }

  return <ExpenseItem expense={expense} onDelete={handleDeleteExpense} editable={true} />
}
