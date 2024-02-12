import { Metadata } from "next"
import { Suspense } from "react"
import { NewExpense } from "../components/NewExpense"
import Loading from "@/src/app/loading"

export const metadata: Metadata = {
  title: "Nouvelle dépense",
  description: "Créer une nouvelle dépense",
}

export default function Page() {
  return (
    <Suspense fallback={Loading()}>
      <NewExpense />
    </Suspense>
  )
}
