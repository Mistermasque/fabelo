import { FieldArray, useFormikContext } from "formik"
import React from "react"
import { Form, FormProps } from "src/app/components/Form"
import { LabeledTextField } from "src/app/components/LabeledTextField"

import { z } from "zod"
import { ExpenseDetailInputs } from "./ExpenseDetailInputs"
import { CreateExpenseSchema, UpdateExpenseSchema } from "src/app/expenses/schemas"

export { FORM_ERROR } from "src/app/components/Form"

export function ExpenseForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const handleAddDetail = () => {}

  const Details = () => {
    const { values } = useFormikContext<
      z.infer<typeof CreateExpenseSchema> | z.infer<typeof UpdateExpenseSchema>
    >()

    return (
      <FieldArray
        name="details"
        render={(arrayHelpers) => (
          <div>
            {values.details && values.details.length > 0
              ? values.details.map((detail, index) => (
                  <ExpenseDetailInputs
                    key={index}
                    detail={detail}
                    index={index}
                    onRemove={(index) => arrayHelpers.remove(index)}
                    canDelete={values.details.length > 1}
                  />
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
              {/* show this when user has removed all friends from the list */}
              Ajouter un détail
            </button>
          </div>
        )}
      />
    )
  }

  return (
    <Form<S> {...props}>
      <Details />
    </Form>
  )
}
