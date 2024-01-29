import { Metadata } from "next"
import { Suspense } from "react"
import { NewExpense } from "../components/NewExpense"

export const metadata: Metadata = {
  title: "Nouvelle dépense",
  description: "Créer une nouvelle dépense",
}

export default function Page() {
  return (
    <div>
      <h1>Nouvelle dépense</h1>
      <Suspense fallback={<div>Chargement...</div>}>
        <NewExpense />
      </Suspense>
    </div>
  )
}
