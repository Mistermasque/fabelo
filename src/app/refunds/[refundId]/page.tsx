import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getRefund from "../queries/getRefund"
import { RefundView } from "../components/RefundView"
import Loading from "app/loading"

export async function generateMetadata({ params }: RefundPageProps): Promise<Metadata> {
  const refund = await invoke(getRefund, { id: Number(params.refundId) })
  return {
    title: `Rbst #${refund.id}`,
    description: `Remboursement #${refund.id}`,
  }
}

type RefundPageProps = {
  params: { refundId: string }
}

export default async function Page({ params }: RefundPageProps) {
  return (
    <Suspense fallback={Loading()}>
      <RefundView refundId={Number(params.refundId)} />
    </Suspense>
  )
}
