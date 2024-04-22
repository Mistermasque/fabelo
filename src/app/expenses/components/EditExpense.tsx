"use client"
import { FORM_ERROR, ExpenseForm } from "./ExpenseForm"
import { UpdateExpenseSchema } from "../schemas"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import { usePageTitle } from "app/hooks/usePageTitle"
import getExpenseWithoutTotalAmount from "../queries/getExpenseWithoutTotalAmount"
import updateExpense from "../mutations/updateExpense"
import { useEffect } from "react"

export interface EditExpenseProps {
  expenseId: number
}

export function EditExpense({ expenseId }: EditExpenseProps) {
  const [expense, { setQueryData }] = useQuery(
    getExpenseWithoutTotalAmount,
    { id: expenseId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateExpenseMutation] = useMutation(updateExpense)

  const router = useRouter()
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle(`Modification dépense #${expenseId}`)
  })

  const initialValues = expense

  return (
    <ExpenseForm
      submitText="Modification dépense"
      schema={UpdateExpenseSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        values.id = expense.id
        try {
          const updated = await updateExpenseMutation(values)
          await setQueryData(updated)
          router.push("/expenses")
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
