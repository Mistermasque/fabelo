import { Field, FieldArray, FieldArrayRenderProps, useFormikContext } from "formik"
import { TextField } from "formik-mui"
import { DatePicker } from "@/src/app/components/formik-mui-date-picker/DatePicker"

import React, { PropsWithoutRef, useEffect } from "react"
import {
  CreateExpenseDetailSchema,
  UpdateExpenseDetailSchema,
} from "src/app/expense-details/schemas"

import { z } from "zod"
import { CreateExpenseSchema, UpdateExpenseSchema } from "../schemas"
import dayjs from "dayjs"
import { Stack } from "@mui/system"
import { Divider, Button, InputAdornment } from "@mui/material"
import { Add, Remove } from "@mui/icons-material"
export { FORM_ERROR } from "src/app/components/Form"

export type Detail =
  | z.infer<typeof CreateExpenseDetailSchema>
  | z.infer<typeof UpdateExpenseDetailSchema>

export interface ExpenseDetailsInputsProps {
  onUpdateTotalAmount: (total: number) => void
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function ExpenseDetailsInputs({
  onUpdateTotalAmount,
  outerProps,
}: ExpenseDetailsInputsProps) {
  const { values, setFieldValue } = useFormikContext<
    z.infer<typeof CreateExpenseSchema> | z.infer<typeof UpdateExpenseSchema>
  >()

  const handleRemove = (arrayHelpers: FieldArrayRenderProps, index: number, detail: Detail) => {
    // TODO CONFIRM
    arrayHelpers.remove(index)
  }

  // Recalcul du total uniquement si les détails ont changé
  useEffect(() => {
    const total: number = values.details.reduce((accumulator, detail) => {
      if (!detail.amount || Number.isNaN(detail.amount)) {
        return accumulator
      }
      return accumulator + Number(detail.amount)
    }, 0)

    onUpdateTotalAmount(total)
  }, [values.details, onUpdateTotalAmount])

  return (
    <FieldArray
      name="details"
      render={(arrayHelpers) => (
        <>
          <Stack divider={<Divider flexItem />} spacing={2}>
            {values.details && values.details.length > 0
              ? values.details.map((detail, index) => (
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} key={index}>
                    <Field
                      component={DatePicker}
                      name={"details[" + index + "].date"}
                      label="Date de la dépense"
                    />
                    <Field
                      component={TextField}
                      name={"details[" + index + "].amount"}
                      label="Montant"
                      placeholder="Montant"
                      type="number"
                      helperText="Valeur négative pour indiquer un remboursement"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                      }}
                    />
                    <Field
                      component={TextField}
                      name={"details[" + index + "].comment"}
                      label="Commentaire"
                      placeholder="Commentaire"
                      multiline
                      sx={{ width: "100%" }}
                    />
                    {
                      // On ne peut pas supprimer le dernier élément
                      values.details.length > 1 ? (
                        <div>
                          <Button
                            onClick={() => handleRemove(arrayHelpers, index, detail)}
                            color="error"
                            sx={{
                              display: { xs: "none", sm: "inline-flex" },
                              py: 2,
                              lineHeight: 3,
                            }}
                            aria-label="supprimer détail"
                            title="Supprimer le détail"
                          >
                            <Remove />
                          </Button>
                          <Button
                            startIcon={<Remove />}
                            onClick={() => handleRemove(arrayHelpers, index, detail)}
                            color="error"
                            sx={{ display: { xs: "inline-flex", sm: "none" } }}
                            fullWidth
                          >
                            Supprimer le détail
                          </Button>
                        </div>
                      ) : null
                    }
                  </Stack>
                ))
              : null}
            <Button
              startIcon={<Add />}
              onClick={() =>
                arrayHelpers.push({
                  value: 0,
                  date: dayjs() as any,
                  comment: "",
                })
              }
            >
              Ajouter un détail
            </Button>
          </Stack>
        </>
      )}
    />
  )
}
