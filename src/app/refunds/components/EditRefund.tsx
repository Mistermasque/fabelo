"use client"
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

  const initialValues = refund

  return (
    <RefundForm
      expenses={refund.expenses}
      submitText="Mettre à jour le remboursement"
      initialValues={initialValues}
      schema={UpdateRefundSchema}
      onSubmit={async (values) => {
        try {
          const refund = await updateRefundMutation(values)
          router.push("/refunds")
        } catch (error: any) {
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
