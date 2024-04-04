import { Metadata } from "next"
import { Suspense } from "react"
import { NewRefund } from "../components/NewRefund"
import Loading from "app/loading"

export const metadata: Metadata = {
  title: "Nouveau remboursement",
  description: "Création d'un nouveau remboursement",
}

export default function Page() {
  return (
    <Suspense fallback={Loading()}>
      <NewRefund />
    </Suspense>
  )
}
