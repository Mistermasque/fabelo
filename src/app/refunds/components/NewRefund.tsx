"use client"
import { FORM_ERROR, RefundForm } from "./RefundForm"
import { CreateRefundSchema } from "../schemas"
import { useMutation, useQuery } from "@blitzjs/rpc"
import createRefund from "../mutations/createRefund"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"
import getNotRefundedExpenses from "app/expenses/queries/getNotRefundedExpenses"

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
    // Il faut utiliser dayjs pour le DatePicker v6
    // https://next.mui.com/x/migration/migration-pickers-v5/#update-the-format-of-the-value-prop
    // et dayjs ne renvoie pas un type Date, on le passe en any pour éviter l'erreur typescript
    date: dayjs() as any,
    isValidated: false,
  }

  return (
    <RefundForm
      expenses={expenses}
      submitText="Créer le remboursement"
      initialValues={initialValues}
      schema={CreateRefundSchema}
      onSubmit={async (values) => {
        try {
          const refund = await createRefundMutation(values)
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
