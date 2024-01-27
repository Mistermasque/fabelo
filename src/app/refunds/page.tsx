import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { RefundsList } from "./components/RefundsList"

export const metadata: Metadata = {
  title: "Refunds",
  description: "List of refunds",
}

export default function Page() {
  return (
    <div>
      <p>
        <Link href={"/refunds/new"}>Create Refund</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <RefundsList />
      </Suspense>
    </div>
  )
}
