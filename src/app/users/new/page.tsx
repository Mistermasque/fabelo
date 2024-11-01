import { Metadata } from "next"
import { Suspense } from "react"
import { NewUser } from "../components/NewUser"
import Loading from "app/loading"

export const metadata: Metadata = {
  title: "Nouvel utilisateur",
  description: "Créer un nouvel utilisateur",
}

export default function Page() {
  return (
    <Suspense fallback={Loading()}>
      <NewUser />
    </Suspense>
  )
}
