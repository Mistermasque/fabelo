import { FilterExpensesSchema } from "app/expenses/queries/getExpenses"
import { Prisma } from "db"
import { WithBalances } from "./computeBalances"

export type FilterExpensesType = z.infer<typeof FilterExpensesSchema>
export type ExpenseRecordWithRefund = WithTotalAmount<
  Prisma.ExpenseGetPayload<{
    include: {
      user: { select: { id: true; name: true } }
      details: true
      parts: { include: { user: { select: { id: true; name: true } } } }
      refund: { include: { user: { select: { id: true; name: true } } } }
    }
  }>
>

export type ExpenseRecordWithoutRefund = WithTotalAmount<
  Prisma.ExpenseGetPayload<{
    include: {
      user: { select: { id: true; name: true } }
      details: true
      parts: { include: { user: { select: { id: true; name: true } } } }
    }
  }>
>

export type ExpenseRecord = ExpenseRecordWithRefund | ExpenseRecordWithoutRefund
export type ExpensePartRecord = Prisma.ExpenseUserPartGetPayload<{
  include: { user: { select: { id: true; name: true } } }
}>

export type ExpenseDetailRecord = Prisma.ExpenseDetailGetPayload<{}>

export type RefundRecordWithoutBalances = Prisma.RefundGetPayload<{
  include: {
    user: { select: { id: true; name: true } }
  }
}> & {
  expenses: ExpenseRecordWithoutRefund[] | null
}

export type RefundRecord = WithBalances<RefundRecordWithoutBalances>
