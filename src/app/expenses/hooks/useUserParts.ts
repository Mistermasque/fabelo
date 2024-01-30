import getUsers from "src/app/users/queries/getUsers"
import { useState } from "react"
import { useQuery } from "@blitzjs/rpc"
import { z } from "zod"
import {
  CreateExpenseUserPartSchema,
  UpdateExpenseUserPartSchema,
} from "src/app/expense-user-parts/schemas"

type SetPartType = (userId: number, part: number, isAmount?: boolean) => void
type SetTotalType = (total: number) => void
type PartType =
  | z.infer<typeof CreateExpenseUserPartSchema>
  | z.infer<typeof UpdateExpenseUserPartSchema>

type PartsType = {
  total: number // Le montant total
  parts: PartType[]
}

/**
 * Hook permettant de recalculer tous les parts utilisateurs
 * @param initial états des parts pour chacun des utilisateurs
 * @return {
 *  parts {PartType[]} état des parts
 *  setPart {SetPartType} mise à jour d'un part pour un utilisateur
 *  setTotal {SetTotalType} Mise à jour du montant total
 *  }
 */
export function useUserParts(initial?: PartsType): {
  parts: PartType[]
  setPart: SetPartType
  setTotal: SetTotalType
} {
  const [users, {}] = useQuery(
    getUsers,
    {},
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )

  // Si initial n'est pas définie, on en créé une avec la liste des utilisateurs
  if (initial === undefined) {
    let parts: PartType[] = []
    users.forEach((user) => {
      parts.push({
        userId: user.id,
        part: 1,
        amount: 0,
        isAmount: false,
      })
    })
    initial = {
      total: 0,
      parts: parts,
    }
  }

  const [total, setTotal] = useState(initial.total)
  const [parts, setParts] = useState(initial.parts)

  const setPart = (userId: number, value: number, isAmount?: boolean) => {
    if (isAmount && value > total) {
      return
    }

    if (!isAmount && value < 0) {
      return
    }

    let userFound = false
    let newParts: PartType[] = []

    // Check user found, update part value and total part
    parts.forEach((part) => {
      let partValue: number | undefined = undefined
      let amountValue: number = 0
      let isAmountValue: boolean = false

      if (part.userId == userId) {
        userFound = true

        if (isAmount) {
          isAmountValue = true
          amountValue = value
        } else {
          partValue = value
        }
      }

      newParts.push({
        userId: part.userId,
        part: partValue,
        amount: amountValue,
        isAmount: isAmountValue,
      })
    })

    if (!userFound) {
      return
    }

    updatePartsFromNewValues(newParts)
  }

  /**
   * Reconstruit les partType en recalculant les ratios et montants
   * manquants et les positionne dans le hook
   * @param newValues
   */
  const updatePartsFromNewValues = (newValues: PartType[]) => {
    let amountTotal = total
    let nbTotalParts = 0

    // Récupération du nombre de parts et du montant restant
    newValues.forEach((part) => {
      if (part.isAmount) {
        amountTotal -= part.amount
      } else if (part.part !== undefined) {
        nbTotalParts += part.part
      }
    })

    // Mise à jour des montants et des parts
    newValues.forEach((part) => {
      if (!part.isAmount) {
        if (part.part === undefined) {
          part.part = 1
        }
        part.amount = (amountTotal * part.part) / nbTotalParts
      } else {
        part.part = undefined
      }
    })

    setParts(newValues)
  }

  const setTotalAmount = (newTotal: number) => {
    setTotal(newTotal)

    // recalcul des montants
    updatePartsFromNewValues({ ...parts })
  }

  return { parts, setPart, setTotal: setTotalAmount }
}
