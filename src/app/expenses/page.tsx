import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ExpensesList } from "./components/ExpensesList"

export const metadata: Metadata = {
  title: "Expenses",
  description: "List of expenses",
}

export default function Page() {
  return (
    <div>
      <p>
        <Link href={"/expenses/new"}>Create Expense</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <ExpensesList />
      </Suspense>
    </div>
  )
}
