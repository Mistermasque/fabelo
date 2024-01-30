import { FieldArray, FieldArrayRenderProps, useFormikContext } from "formik"
import React, { ChangeEvent, PropsWithoutRef } from "react"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import {
  CreateExpenseDetailSchema,
  UpdateExpenseDetailSchema,
} from "src/app/expense-details/schemas"

import { z } from "zod"
import { CreateExpenseSchema, UpdateExpenseSchema } from "../schemas"
export { FORM_ERROR } from "src/app/components/Form"

export type Detail =
  | z.infer<typeof CreateExpenseDetailSchema>
  | z.infer<typeof UpdateExpenseDetailSchema>

export interface ExpenseDetailsInputsProps {
  onRemove: (detail: Detail) => void
  onUpdateAmount: (detail: Detail, newAmont: number) => void
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export function ExpenseDetailsInputs({
  onRemove,
  onUpdateAmount,
  outerProps,
}: ExpenseDetailsInputsProps) {
  const { values, setFieldValue } = useFormikContext<
    z.infer<typeof CreateExpenseSchema> | z.infer<typeof UpdateExpenseSchema>
  >()

  const handleRemove = (arrayHelpers: FieldArrayRenderProps, index: number, detail: Detail) => {
    // TODO CONFIRM
    arrayHelpers.remove(index)
    onRemove(detail)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number, detail: Detail) => {
    setFieldValue(`details[${index}].amount`, event.target.value)
    onUpdateAmount(detail, values.details[index].amount)
  }

  return (
    <FieldArray
      name="details"
      render={(arrayHelpers) => (
        <div {...outerProps}>
          {values.details && values.details.length > 0
            ? values.details.map((detail, index) => (
                <div key={index}>
                  <LabeledTextField
                    name={"details[" + index + "].date"}
                    label="Date"
                    placeholder="Date"
                    type="text"
                  />
                  <LabeledTextField
                    name={"details[" + index + "].comment"}
                    label="Commentaire"
                    placeholder="Commentaire"
                    type="text"
                  />
                  <LabeledTextField
                    name={"details[" + index + "].amount"}
                    label="Montant"
                    placeholder="Montant"
                    type="number"
                    onChange={(event) => handleChange(event, index, detail)}
                    value={detail.amount}
                  />
                  {
                    // On ne peut pas supprimer le dernier élément
                    values.details.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemove(arrayHelpers, index, detail)}
                      >
                        Supprimer le détail
                      </button>
                    ) : null
                  }
                </div>
              ))
            : null}
          <button
            type="button"
            onClick={() =>
              arrayHelpers.push({
                value: 0,
                date: new Date(),
                comment: "",
              })
            }
          >
            Ajouter un détail
          </button>
        </div>
      )}
    />
  )
}
