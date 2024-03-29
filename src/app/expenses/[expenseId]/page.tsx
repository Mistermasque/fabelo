import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getExpense from "../queries/getExpense"
import { Expense } from "../components/Expense"
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
    <div>
      <p>
        <Link href={"/expenses"}>Expenses</Link>
      </p>
      <Suspense fallback={Loading()}>
        <Expense expenseId={Number(params.expenseId)} />
      </Suspense>
    </div>
  )
}
