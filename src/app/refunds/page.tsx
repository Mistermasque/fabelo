import { Metadata } from "next"
import { Suspense } from "react"
import Loading from "../loading"
import { RefundsList } from "./components/RefundsList"

export const metadata: Metadata = {
  title: "Remboursements",
  description: "Liste des remboursements",
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RefundsList />
    </Suspense>
  )
}
