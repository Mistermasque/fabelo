"use client"
import { FORM_ERROR, RefundForm } from "./RefundForm"
import { CreateRefundSchema } from "../schemas"
import { useMutation, useQuery } from "@blitzjs/rpc"
import createRefund from "../mutations/createRefund"
import { useRouter } from "next/navigation"
import getNotRefundedExpenses from "app/expenses/queries/getNotRefundedExpenses"
import { useSnackbar } from "notistack"

export function NewRefund() {
  const [createRefundMutation] = useMutation(createRefund)
  const router = useRouter()

  const [expenses] = useQuery(
    getNotRefundedExpenses,
    {
      orderBy: { createdAt: "asc" },
    },
    { staleTime: Infinity }
  )

  const expenseIds: number[] = expenses.map((expense) => {
    return expense.id
  })

  const initialValues = {
    expenseIds: expenseIds,
    comment: "",
    date: new Date(),
    isValidated: false,
  }

  const { enqueueSnackbar } = useSnackbar()

  return (
    <RefundForm
      expenses={expenses}
      submitText="Créer le remboursement"
      initialValues={initialValues}
      schema={CreateRefundSchema}
      onSubmit={async (values) => {
        try {
          const refund = await createRefundMutation(values)
          enqueueSnackbar("Remboursement #" + refund?.id + " créé", { variant: "success" })
          router.push("/refunds")
        } catch (error: any) {
          return {
            [FORM_ERROR]: error.message,
          }
        }
      }}
    />
  )
}
