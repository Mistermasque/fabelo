"use client"
import { FORM_ERROR, ExpenseForm } from "./ExpenseForm"
import { CreateExpenseSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createExpense from "../mutations/createExpense"
import { useRouter } from "next/navigation"

export function New__ModelName() {
  const [createExpenseMutation] = useMutation(createExpense)
  const router = useRouter()
  return (
    <ExpenseForm
      submitText="Create Expense"
      schema={CreateExpenseSchema}
      onSubmit={async (values) => {
        try {
          const expense = await createExpenseMutation(values)
          router.push(`/expenses/${expense.id}`)
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
