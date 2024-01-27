"use client"
import { FORM_ERROR, RefundForm } from "./RefundForm"
import { CreateRefundSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createRefund from "../mutations/createRefund"
import { useRouter } from "next/navigation"

export function New__ModelName() {
  const [createRefundMutation] = useMutation(createRefund)
  const router = useRouter()
  return (
    <RefundForm
      submitText="Create Refund"
      schema={CreateRefundSchema}
      onSubmit={async (values) => {
        try {
          const refund = await createRefundMutation(values)
          router.push(`/refunds/${refund.id}`)
        } catch (error: any) {
          console.error(error)
          return {
            [FORM_ERROR]: error.toString(),
          }
        }
      }}
    />
  )
}
