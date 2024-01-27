"use client"
import { useMutation, useQuery } from "@blitzjs/rpc"
import Link from "next/link"
import { useRouter } from "next/navigation"
import deleteRefund from "../mutations/deleteRefund"
import getRefund from "../queries/getRefund"

export const Refund = ({ refundId }: { refundId: number }) => {
  const router = useRouter()
  const [deleteRefundMutation] = useMutation(deleteRefund)
  const [refund] = useQuery(getRefund, { id: refundId })

  return (
    <>
      <div>
        <h1>Project {refund.id}</h1>
        <pre>{JSON.stringify(refund, null, 2)}</pre>

        <Link href={`/refunds/${refund.id}/edit`}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteRefundMutation({ id: refund.id })
              router.push("/refunds")
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}
