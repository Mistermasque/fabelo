"use client"
import { FORM_ERROR, ExpenseForm } from "./ExpenseForm"
import { CreateExpenseSchema } from "../schemas"
import { useMutation } from "@blitzjs/rpc"
import createExpense from "../mutations/createExpense"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import { usePageTitle } from "app/hooks/usePageTitle"

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
        date: new Date(),
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
