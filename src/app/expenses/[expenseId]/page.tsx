import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getExpense from "../queries/getExpense"
import { ExpenseView } from "../components/ExpenseView"
import Loading from "@/src/app/loading"

export async function generateMetadata({ params }: ExpensePageProps): Promise<Metadata> {
  const Expense = await invoke(getExpense, { id: Number(params.expenseId) })
  return {
    title: `Dépense #${Expense.id}`,
  }
}

type ExpensePageProps = {
  params: { expenseId: string }
}

export default async function Page({ params }: ExpensePageProps) {
  return (
    <Suspense fallback={Loading()}>
      <ExpenseView expenseId={Number(params.expenseId)} />
    </Suspense>
  )
}
