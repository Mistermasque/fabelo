import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { ExpensesList } from "./components/ExpensesList"
import Loading from "@/src/app/loading"

export const metadata: Metadata = {
  title: "Dépenses",
  description: "List des dépenses",
}

export default function Page() {
  return (
    <div>
      <p>
        <Link href={"/expenses/new"}>Nouvelle dépense</Link>
      </p>
      <Suspense fallback={Loading()}>
        <ExpensesList />
      </Suspense>
    </div>
  )
}
