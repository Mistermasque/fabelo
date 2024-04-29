import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getRefund from "../../queries/getRefund"
import { EditRefund } from "../../components/EditRefund"
import Loading from "@/src/app/loading"

type EditRefundPageProps = {
  params: { refundId: string }
}

export async function generateMetadata({ params }: EditRefundPageProps): Promise<Metadata> {
  const refund = await invoke(getRefund, { id: Number(params.refundId) })
  return {
    title: `Modif. rbst #${refund.id}`,
    description: `Modification remboursement #${refund.id}`,
  }
}

export default async function Page({ params }: EditRefundPageProps) {
  return (
    <div>
      <Suspense fallback={Loading()}>
        <EditRefund refundId={Number(params.refundId)} />
      </Suspense>
    </div>
  )
}
