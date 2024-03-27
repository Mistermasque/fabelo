import { Prisma } from "@prisma/client"
import { useSearchParams } from "next/navigation"

type OrderType =
  | {
      [key: string]: Prisma.SortOrder
    }
  | {
      [key: string]: Prisma.SortOrder
    }[]

/**
 * Hook utilisé pour extraire les paramètres GET et les mettre à jour dans les searchparams
 * @param initialFilters
 * @returns
 */
export function useSearchFilters<T extends object>(
  initialFilters: T,
  initialdOrder?: OrderType | string
) {
  // le point d'exclamation indique qu'on est sur que la valeur searchParams ne sera jamais nulle
  const searchParams = useSearchParams()!
  const params = new URLSearchParams(searchParams)

  const mergeURLParams = (values?: T): URLSearchParams => {
    if (!values) {
      return params
    }

    for (const [key, value] of Object.entries(values)) {
      value !== undefined && value !== null && params.set(key, value.toString())
    }

    return params
  }

  const getFiltersFromURL = (allowedKeys?: string[]): { [key: string]: string } => {
    let ret: { [key: string]: string } = {}

    for (const [key, value] of Object.entries(initialFilters)) {
      if (key !== "orderBy" && allowedKeys && allowedKeys.includes(key)) {
        ret[key] = params.get(key) ?? (value ? value.toString() : "")
      }
    }

    return ret
  }

  const getOrderByFromURL = (): OrderType | null => {
    const orderByStrValues = params.getAll("orderBy")

    if (orderByStrValues.length == 0) {
      if (!initialdOrder) {
        return null
      } else if (typeof initialdOrder !== "string") {
        return initialdOrder
      }
      return formatOrderByStringValue(initialdOrder)
    }

    let ret: OrderType = []

    for (const orderByStrValue of orderByStrValues) {
      const orderByValue = formatOrderByStringValue(orderByStrValue)
      if (orderByValue) {
        ret.push(orderByValue)
      }
    }

    if (ret.length == 0) {
      if (!initialdOrder) {
        return null
      } else if (typeof initialdOrder !== "string") {
        return initialdOrder
      }
      return formatOrderByStringValue(initialdOrder)
    }

    return ret
  }

  return { mergeURLParams, getFiltersFromURL, getOrderByFromURL }
}

function formatOrderByStringValue(value: string): {
  [key: string]: Prisma.SortOrder
} | null {
  const orderByVals = value.split(".")
  const field = orderByVals[0]
  const order =
    orderByVals.length > 1 && orderByVals[1] in Prisma.SortOrder ? orderByVals[1] : "asc"
  if (!field) {
    return null
  }

  let ret: {
    [key: string]: Prisma.SortOrder
  } = {}

  ret[field] = order as Prisma.SortOrder

  return ret
}
