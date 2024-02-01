"use client"
import { Suspense } from "react"
import updateExpense from "../mutations/updateExpense"
import getExpense from "../queries/getExpense"
import { UpdateExpenseSchema } from "../schemas"
import { FORM_ERROR, ExpenseForm } from "./ExpenseForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"
import Loading from "@/src/app/loading"

export const EditExpense = ({ expenseId }: { expenseId: number }) => {
  const [expense, { setQueryData }] = useQuery(
    getExpense,
    { id: expenseId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateExpenseMutation] = useMutation(updateExpense)
  const router = useRouter()
  return (
    <>
      <div>
        <h1>Modification dépense #{expense.id}</h1>
        <pre>{JSON.stringify(expense, null, 2)}</pre>
        <Suspense fallback={Loading()}>
          <ExpenseForm
            submitText="Update Expense"
            schema={UpdateExpenseSchema}
            // @ts-ignore
            initialValues={expense}
            onSubmit={async (values) => {
              try {
                const updated = await updateExpenseMutation({
                  ...values,
                  id: expense.id,
                })
                await setQueryData(updated)
                router.refresh()
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}
