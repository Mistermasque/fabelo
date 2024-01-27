"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteExpense from "../mutations/deleteExpense"
import getExpense from "../queries/getExpense"

export const Expense = ({ expenseId }: { expenseId: number }) => {
  const router = useRouter()
  const [deleteExpenseMutation] = useMutation(deleteExpense)
  const [expense] = useQuery(getExpense, { id: expenseId })

  return (
    <>
      <div>
        <h1>Project {expense.id}</h1>
        <pre>{JSON.stringify(expense, null, 2)}</pre>

        <Link href={`/expenses/${expense.id}/edit`}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteExpenseMutation({ id: expense.id })
              router.push("/expenses")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}
