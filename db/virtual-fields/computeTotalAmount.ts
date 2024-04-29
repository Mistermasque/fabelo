import { Decimal } from "@prisma/client/runtime/library"

// Type nécessitant la présence des détails
type AmountDetails = {
  details: {
    amount: number | Decimal
  }[]
}

// Type nécessitant la présence du totalAmount
type ExpenseWithTotalAmount = {
  expenses:
    | {
        totalAmount: number
      }[]
    | null
}

// On étend le type générique T pour y ajouter le montant total
export type WithTotalAmount<T> = T & {
  totalAmount: number
}

/**
 * Fonction permettant d'ajouter le montant total à la dépense ou au refund
 * @param record : la dépense ou le remboursement
 * @returns l'objet dépense ou remboursement avec le montant total
 */
export default function computeTotalAmount<T extends AmountDetails | ExpenseWithTotalAmount>(
  record: T
): WithTotalAmount<T> {
  let totalAmount = 0

  // Vérification de type pour AmountDetails
  if ("details" in record) {
    // record est de type AmountDetails
    totalAmount = record.details.reduce((accumulator, detail) => {
      return accumulator + Number(detail.amount)
    }, 0)
  } else if ("expenses" in record) {
    // Vérification de type pour ExpenseWithTotalAmount
    // record est de type ExpenseWithTotalAmount
    totalAmount = record.expenses
      ? record.expenses.reduce((accumulator, expense) => {
          return accumulator + Number(expense.totalAmount)
        }, 0)
      : 0
  } else {
    // Si le type n'est ni AmountDetails ni ExpenseWithTotalAmount, une erreur peut être levée ou un comportement par défaut peut être défini
    throw new Error("Type de record non pris en charge")
  }

  return { ...record, totalAmount }
}
