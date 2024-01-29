import { useFormikContext } from "formik"
import React, { PropsWithoutRef, Suspense } from "react"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import {
  CreateExpenseDetailSchema,
  UpdateExpenseDetailSchema,
} from "src/app/expense-details/schemas"

import { z } from "zod"
export { FORM_ERROR } from "src/app/components/Form"

export interface ExpenseDetailInputsProps {
  index: number
  detail: z.infer<typeof CreateExpenseDetailSchema> | z.infer<typeof UpdateExpenseDetailSchema>
  onRemove: (index: number) => void
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  canDelete?: boolean
}

export function ExpenseDetailInputs({
  index,
  onRemove,
  outerProps,
  canDelete = true,
}: ExpenseDetailInputsProps) {
  const handleRemoveClick = () => {
    // TODO CONFIRM
    onRemove(index)
  }

  const { handleBlur, handleChange } = useFormikContext()

  return (
    <div {...outerProps}>
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
        type="textarea"
      />
      <LabeledTextField
        name={"details[" + index + "].value"}
        label="Montant"
        placeholder="Montant"
        type="number"
      />
      {canDelete ? (
        <button type="button" onClick={handleRemoveClick}>
          Supprimer le détail
        </button>
      ) : null}
    </div>
  )
}
