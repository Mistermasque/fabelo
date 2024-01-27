import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getRefund from "../queries/getRefund"
import { Refund } from "../components/Refund"

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const Refund = await invoke(getRefund, { id: Number(params.refundId) })
  return {
    title: `Refund ${Refund.id} - ${Refund.name}`,
  }
}

type RefundPageProps = {
  params: { refundId: string }
}

export default async function Page({ params }: RefundPageProps) {
  return (
    <div>
      <p>
        <Link href={"/refunds"}>Refunds</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <Refund refundId={Number(params.refundId)} />
      </Suspense>
    </div>
  )
}
