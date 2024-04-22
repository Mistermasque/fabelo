import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getExpense from "../../queries/getExpense"
import { EditExpense } from "../../components/EditExpense"
import Loading from "@/src/app/loading"

type EditExpensePageProps = {
  params: { expenseId: string }
}

export async function generateMetadata({ params }: EditExpensePageProps): Promise<Metadata> {
  return {
    title: `Modification dépense #${params.expenseId}`,
    description: `Modification dépense #${params.expenseId}`,
  }
}

export default async function Page({ params }: EditExpensePageProps) {
  return (
    <div>
      <Suspense fallback={Loading()}>
        <EditExpense expenseId={Number(params.expenseId)} />
      </Suspense>
    </div>
  )
}
