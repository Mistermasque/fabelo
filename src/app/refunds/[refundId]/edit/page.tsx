import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getRefund from "../../queries/getRefund"
import { EditRefund } from "../../components/EditRefund"

type EditRefundPageProps = {
  params: { refundId: string }
}

export async function generateMetadata({ params }: EditRefundPageProps): Promise<Metadata> {
  const Refund = await invoke(getRefund, { id: Number(params.refundId) })
  return {
    title: `Edit Refund ${Refund.id} - ${Refund.name}`,
  }
}

export default async function Page({ params }: EditRefundPageProps) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditRefund refundId={Number(params.refundId)} />
      </Suspense>
    </div>
  )
}
