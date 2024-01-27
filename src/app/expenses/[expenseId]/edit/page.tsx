import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getExpense from "../../queries/getExpense"
import { EditExpense } from "../../components/EditExpense"

type EditExpensePageProps = {
  params: { expenseId: string }
}

export async function generateMetadata({ params }: EditExpensePageProps): Promise<Metadata> {
  const Expense = await invoke(getExpense, { id: Number(params.expenseId) })
  return {
    title: `Edit Expense ${Expense.id} - ${Expense.name}`,
  }
}

export default async function Page({ params }: EditExpensePageProps) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditExpense expenseId={Number(params.expenseId)} />
      </Suspense>
    </div>
  )
}
