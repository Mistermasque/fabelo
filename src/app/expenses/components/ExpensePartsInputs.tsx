import { Field, FieldArray, useFormikContext } from "formik"
import React, { ChangeEvent, PropsWithoutRef, useEffect } from "react"
import {
  CreateExpenseInput,
  UpdateExpenseInput,
  CreateExpenseUserPartInput,
  UpdateExpenseUserPartInput,
} from "src/app/expenses/schemas"
import { useQuery } from "@blitzjs/rpc"
import getUsers from "../../users/queries/getUsers"
import { Box, Divider, InputAdornment, Stack } from "@mui/material"
import { TextField } from "formik-mui"
export { FORM_ERROR } from "src/app/components/Form"

type User = { name: string | null; id: number }

type PartValue = CreateExpenseUserPartInput | UpdateExpenseUserPartInput

type Part = {
  userId: number
  part?: number | null
  amount: number
  isAmount: boolean
}

function buildParts(users: User[], partValues: PartValue[], totalAmount: number): Part[] {
  let parts: Part[] = []
  const partValuesDefined = partValues && partValues.length != 0

  // Construction des valeurs de base
  users.forEach((user) => {
    const defaultValue = {
      userId: user.id,
      part: 1,
      amount: 0,
      isAmount: false,
    }

    const partVal = partValuesDefined
      ? partValues.find((part) => part.userId == user.id)
      : undefined

    const value = partVal
      ? {
          userId: user.id,
          // si part ne correspond pas à un nombre on prend la valeur par défaut
          // sinon, on ne la prend que s'il est supérieur ou égale à 0
          part: Number.isNaN(partVal.part)
            ? defaultValue.part
            : Number(partVal.part) >= 0
            ? Number(partVal.part)
            : 0,
          // si amount ne correspond pas à un nombre on prend la valeur par défaut
          // sinon, on ne la prend que s'il est supérieure ou égale à 0
          amount:
            Number.isNaN(partVal.amount) || partVal.amount < 0
              ? defaultValue.amount
              : Number(partVal.amount),
          isAmount: Boolean(partVal.isAmount),
        }
      : defaultValue

    parts.push(value)
  })

  let amount = totalAmount
  let nbTotalParts = 0

  // Récupération du nombre de parts et du montant restant
  parts.forEach((part) => {
    if (part.isAmount) {
      amount -= part.amount
    } else if (part.part) {
      nbTotalParts += part.part
    }
  })

  // Mise à jour des montants et des parts
  parts.forEach((part) => {
    if (part.isAmount) {
      part.part = null
    } else {
      part.amount = (amount * Number(part.part)) / nbTotalParts
    }
  })

  return parts
}

export interface ExpensePartsInputsProps {
  totalAmount: number
}

export function ExpensePartsInputs({ totalAmount }: ExpensePartsInputsProps) {
  const { values, setFieldValue, handleChange } = useFormikContext<
    CreateExpenseInput | UpdateExpenseInput
  >()

  const [users, {}] = useQuery(
    getUsers,
    { order: "name" },
    {
      staleTime: Infinity,
    }
  )

  values.parts = buildParts(users, values.parts, totalAmount)

  const handleChangePart = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    handleChange(e)
    setFieldValue(`parts[${index}].isAmount`, false)
  }

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    handleChange(e)
    setFieldValue(`parts[${index}].isAmount`, true)
  }

  return values.isDefaultParts ? null : (
    <FieldArray
      name="parts"
      render={() => (
        <Stack divider={<Divider flexItem />} spacing={2}>
          {users.map((user, index) => (
            <Stack
              alignItems={{ xs: "flex-start", sm: "center" }}
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              key={index}
            >
              <Box sx={{ width: { sm: "50%" }, flexGrow: 1 }}>
                <strong>{user.name}</strong>
              </Box>

              <input name={"parts[" + index + "].userId"} type="hidden" />
              <input name={"parts[" + index + "].isAmount"} type="hidden" />
              <Field
                name={"parts[" + index + "].part"}
                label="Part"
                placeholder="Part"
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangePart(e, index)}
                value={values.parts[index].part ?? ""}
                component={TextField}
                sx={{ width: { xs: "100%", sm: "15%" } }}
              />
              <Field
                name={"parts[" + index + "].amount"}
                label="Montant"
                placeholder="Montant"
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeAmount(e, index)}
                component={TextField}
                sx={{ width: { xs: "100%", sm: "25%" } }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">€</InputAdornment>,
                }}
              />
            </Stack>
          ))}
        </Stack>
      )}
    />
  )
}
