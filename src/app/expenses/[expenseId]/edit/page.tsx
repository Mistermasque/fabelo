import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getExpense from "../../queries/getExpense"
import { EditExpense } from "../../components/EditExpense"
import Loading from "@/src/app/loading"

type EditExpensePageProps = {
  params: { expenseId: string }
}

export async function generateMetadata({ params }: EditExpensePageProps): Promise<Metadata> {
  const Expense = await invoke(getExpense, { id: Number(params.expenseId) })
  return {
    title: `Modification dépense #${Expense.id}`,
  }
}

export default async function Page({ params }: EditExpensePageProps) {
  return (
    <div>
      <Suspense fallback={Loading()}>
        <EditExpense expenseId={Number(params.expenseId)} />
      </Suspense>
    </div>
  )
}
