import { Field, FieldArray, FieldArrayRenderProps, useFormikContext } from "formik"
import { TextField } from "formik-mui"
import { DatePicker } from "@/src/app/components/formik-mui/DatePicker"
import React, { useEffect } from "react"
import {
  CreateExpenseDetailInput,
  CreateExpenseInput,
  UpdateExpenseDetailInput,
  UpdateExpenseInput,
} from "../schemas"
import { Stack } from "@mui/system"
import { Divider, Button, InputAdornment } from "@mui/material"
import { Add, Remove } from "@mui/icons-material"
import { useConfirm } from "material-ui-confirm"
export { FORM_ERROR } from "src/app/components/Form"

export type Detail = CreateExpenseDetailInput | UpdateExpenseDetailInput

export interface ExpenseDetailsInputsProps {
  onUpdateTotalAmount: (total: number) => void
}

export function ExpenseDetailsInputs({ onUpdateTotalAmount }: ExpenseDetailsInputsProps) {
  const { values } = useFormikContext<CreateExpenseInput | UpdateExpenseInput>()
  const details: Detail[] = values.details
  const confirm = useConfirm()

  const handleRemove = (arrayHelpers: FieldArrayRenderProps, index: number, detail: Detail) => {
    // Si le detail est vide, on le supprime sans confirmation
    if (!detail.amount && !detail.comment) {
      arrayHelpers.remove(index)
    } else {
      confirm({
        title: "Êtes-vous sûr ?",
        description: "Ëtes-vous sûr de vouloir supprimer ce détail ?",
        cancellationText: "Annuler",
        confirmationText: "Oui, supprimer",
        confirmationButtonProps: { color: "error" },
      }).then(() => {
        arrayHelpers.remove(index)
      })
    }
  }

  // Recalcul du total uniquement si les détails ont changé
  useEffect(() => {
    const total: number = details.reduce((accumulator, detail) => {
      if (!detail.amount || Number.isNaN(detail.amount)) {
        return accumulator
      }
      return accumulator + Number(detail.amount)
    }, 0)

    onUpdateTotalAmount(total)
  }, [details, onUpdateTotalAmount])

  return (
    <FieldArray
      name="details"
      render={(arrayHelpers) => (
        <>
          <Stack divider={<Divider flexItem />} spacing={2}>
            {details && details.length > 0
              ? details.map((detail, index) => (
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
                      value={detail.amount === null ? "" : detail.amount}
                    />
                    <Field
                      component={TextField}
                      name={"details[" + index + "].comment"}
                      label="Commentaire"
                      placeholder="Commentaire"
                      multiline
                      sx={{ width: "100%" }}
                      value={detail.comment === null ? "" : detail.comment}
                    />
                    {
                      // On ne peut pas supprimer le dernier élément
                      details.length > 1 ? (
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
                  date: new Date(),
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
