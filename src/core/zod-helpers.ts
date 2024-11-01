import { z } from "zod"
import Decimal from "decimal.js"
import { Prisma } from "@prisma/client"
import { isValidDecimalInput, DecimalJsLikeSchema } from "@/db/zod/inputTypeSchemas"

export const ZInputPositiveDecimal = z
  .union([
    z.number(),
    z.string(),
    z.instanceof(Decimal),
    z.instanceof(Prisma.Decimal),
    DecimalJsLikeSchema,
  ])
  .refine(
    (v) => {
      if (!isValidDecimalInput(v)) {
        return false
      }

      if (typeof v === "number") {
        return v >= 0
      }

      if (typeof v === "object") {
        if (v instanceof Decimal || v instanceof Prisma.Decimal) {
          return v.gte(0)
        }
        if (v.hasOwnProperty("toFixed")) {
          const test = new Decimal(v.toFixed())
          return test.gte(0)
        }
      }

      if (typeof v === "string") {
        const test = new Decimal(v)
        return test.gte(0)
      }
      return false
    },
    { message: "Doit être un nombre positif" }
  )
