import { Decimal } from "@prisma/client/runtime/library"

// Type nécessitant la présence des détails
type AmountDetails = {
  details: {
    amount: number | Decimal
  }[]
}

// On étend le type générique T pour y ajouter le montant total
export type WithTotalAmount<T> = T & {
  totalAmount: number
}

/**
 * Fonction permettant d'ajouter le montant total
 * @param expense : la dépense
 * @returns l'objet dépense avec le montant total
 */
export default function computeTotalAmount<Expense extends AmountDetails>(
  expense: Expense
): WithTotalAmount<Expense> {
  const totalAmount = expense.details.reduce((accumulator, detail) => {
    return accumulator + Number(detail.amount)
  }, 0)

  return {
    ...expense,
    totalAmount,
  }
}
