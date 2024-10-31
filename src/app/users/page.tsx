import { Metadata } from "next"
import { Suspense } from "react"
import { UsersList } from "./components/UsersList"
import Loading from "app/loading"

export const metadata: Metadata = {
  title: "Dépenses",
  description: "Liste des dépenses",
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <UsersList />
    </Suspense>
  )
}
