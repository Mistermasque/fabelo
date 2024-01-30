"use client"
import { FORM_ERROR, ExpenseForm } from "./ExpenseForm"
import { CreateExpenseSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createExpense from "../mutations/createExpense"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useCurrentUser } from "../../users/hooks/useCurrentUser"

export function NewExpense() {
  const [createExpenseMutation] = useMutation(createExpense)
  const router = useRouter()
  const user = useCurrentUser()

  const userId = user ? user.id : 0

  const initialValues: z.infer<typeof CreateExpenseSchema> = {
    isDefaultParts: true,
    details: [
      {
        amount: 0,
        comment: "",
        date: new Date(),
      },
    ],
    userId: userId,
    parts: [],
  }

  return (
    <ExpenseForm
      submitText="Create Expense"
      schema={CreateExpenseSchema}
      initialValues={initialValues}
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
