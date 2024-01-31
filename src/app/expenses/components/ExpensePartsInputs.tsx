import { FieldArray, useFormikContext } from "formik"
import React, { ChangeEvent, PropsWithoutRef, Suspense, useEffect, useState } from "react"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { CreateExpenseSchema, UpdateExpenseSchema } from "src/app/expenses/schemas"
import { z } from "zod"
import {
  CreateExpenseUserPartSchema,
  UpdateExpenseUserPartSchema,
} from "src/app/expense-user-parts/schemas"
import { useUserParts } from "../hooks/useUserParts"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "../../users/queries/getUsers"
import { CreateExpenseDetailSchema, UpdateExpenseDetailSchema } from "../../expense-details/schemas"
export { FORM_ERROR } from "src/app/components/Form"

type PartType =
  | (z.infer<typeof CreateExpenseUserPartSchema> & { user?: { name: string | null; id: number } })
  | (z.infer<typeof UpdateExpenseUserPartSchema> & { user?: { name: string | null; id: number } })

export interface ExpensePartsInputsProps {
  totalAmount: number
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

function buildParts(
  users: { name: string | null; id: number }[],
  partValues:
    | z.infer<typeof CreateExpenseUserPartSchema>[]
    | z.infer<typeof UpdateExpenseUserPartSchema>[],
  totalAmount: number
): PartType[] {
  let parts: PartType[] = []

  // Construction des valeurs de base
  users.forEach((user) => {
    let value =
      partValues && partValues.length != 0
        ? partValues.find((part) => part.userId == user.id)
        : undefined

    if (!value) {
      value = {
        userId: user.id,
        part: 1,
        amount: 0,
        isAmount: false,
      }
    }

    parts.push({
      ...value,
      user,
    })
  })

  let amount = totalAmount
  let nbTotalParts = 0

  // Récupération du nombre de parts et du montant restant
  parts.forEach((part) => {
    if (part.isAmount) {
      amount -= part.amount
    } else if (part.part !== undefined && part.part !== null) {
      nbTotalParts += part.part
    }
  })

  // Mise à jour des montants et des parts
  parts.forEach((part) => {
    if (!part.isAmount) {
      if (part.part === undefined || part.part === null) {
        part.part = 1
      }
      part.amount = (amount * part.part) / nbTotalParts
    } else {
      part.part = undefined
    }
  })

  return parts
}

export function ExpensePartsInputs({ totalAmount, outerProps }: ExpensePartsInputsProps) {
  const { values, setFieldValue, handleChange } = useFormikContext<
    z.infer<typeof CreateExpenseSchema> | z.infer<typeof UpdateExpenseSchema>
  >()

  const [users, {}] = useQuery(
    getUsers,
    { order: "userId" },
    {
      staleTime: Infinity,
    }
  )

  let parts: PartType[] = values.parts

  useEffect(() => {
    values.parts = buildParts(users, values.parts, totalAmount) as PartType[]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.parts, totalAmount, users])

  // const parts = buildParts(users, values.parts, totalAmount)

  const handleChangePart = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    handleChange(e)
    setFieldValue(`parts[${index}].isAmount`, false)

    // setParts(buildParts(users, values.parts, totalAmount))
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    handleChange(e)
    setFieldValue(`parts[${index}].isAmount`, true)
  }

  return (
    <FieldArray
      name="parts"
      render={() => (
        <div {...outerProps}>
          {parts.map((part, index) => (
            <div key={index}>
              <div>{part.user?.name}</div>
              <input name={"parts[" + index + "].userId"} type="hidden" value={part.userId} />
              <input
                name={"parts[" + index + "].isAmount"}
                type="hidden"
                value={part.isAmount ? 1 : 0}
              />
              <LabeledTextField
                name={"parts[" + index + "].part"}
                label="Part"
                placeholder="Part"
                type="number"
                onChange={(e) => handleChangePart(e, index)}
                value={part.part}
              />
              <LabeledTextField
                name={"parts[" + index + "].amount"}
                label="Montant"
                placeholder="Montant"
                type="number"
                onChange={(e) => handleChangeAmount(e, index)}
                value={part.amount}
              />
            </div>
          ))}
        </div>
      )}
    />
  )
}
