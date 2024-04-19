"use client"
import { FORM_ERROR, ExpenseForm } from "./ExpenseForm"
import { CreateExpenseSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createExpense from "../mutations/createExpense"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import { usePageTitle } from "app/hooks/usePageTitle"

import dayjs from "dayjs"
import { useEffect } from "react"

export function NewExpense() {
  const [createExpenseMutation] = useMutation(createExpense)
  const router = useRouter()
  const user = useCurrentUser()
  const { setPageTitle } = usePageTitle()

  useEffect(() => {
    setPageTitle("Nouvelle dépense")
  })
  const userId = user ? user.id : 0

  const initialValues: z.infer<typeof CreateExpenseSchema> = {
    isDefaultParts: true,
    title: "",
    details: [
      {
        amount: 0,
        comment: "",
        // Il faut utiliser dayjs pour le DatePicker v6
        // https://next.mui.com/x/migration/migration-pickers-v5/#update-the-format-of-the-value-prop
        // et dayjs ne renvoie pas un type Date, on le passe en any pour éviter l'erreur typescript
        date: dayjs() as any,
      },
    ],
    userId: userId,
    parts: [],
  }

  return (
    <ExpenseForm
      submitText="Création dépense"
      schema={CreateExpenseSchema}
      initialValues={initialValues}
      onSubmit={async (values) => {
        try {
          const expense = await createExpenseMutation(values)
          router.push("/expenses")
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
