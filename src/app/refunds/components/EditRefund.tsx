"use client"
import { Suspense } from "react"
import updateRefund from "../mutations/updateRefund"
import getRefund from "../queries/getRefund"
import { UpdateRefundSchema } from "../schemas"
import { FORM_ERROR, RefundForm } from "./RefundForm"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { useRouter } from "next/navigation"

export const EditRefund = ({ refundId }: { refundId: number }) => {
  const [refund, { setQueryData }] = useQuery(
    getRefund,
    { id: refundId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateRefundMutation] = useMutation(updateRefund)
  const router = useRouter()
  return (
    <>
      <div>
        <h1>Edit Refund {refund.id}</h1>
        <pre>{JSON.stringify(refund, null, 2)}</pre>
        <Suspense fallback={<div>Loading...</div>}>
          <RefundForm
            submitText="Update Refund"
            schema={UpdateRefundSchema}
            initialValues={refund}
            onSubmit={async (values) => {
              try {
                const updated = await updateRefundMutation({
                  ...values,
                  id: refund.id,
                })
                await setQueryData(updated)
                router.refresh()
              } catch (error: any) {
                console.error(error)
                return {
                  [FORM_ERROR]: error.toString(),
                }
              }
            }}
          />
        </Suspense>
      </div>
    </>
  )
}
