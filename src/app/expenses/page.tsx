import { Metadata } from "next"
import { Suspense } from "react"
import { ExpensesList } from "./components/ExpensesList"
import Loading from "app/loading"

export const metadata: Metadata = {
  title: "Dépenses",
  description: "Liste des dépenses",
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ExpensesList />
    </Suspense>
  )
}
