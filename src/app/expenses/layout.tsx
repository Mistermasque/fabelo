import { useAuthenticatedBlitzContext } from "src/app/blitz-server"
import { DefaultLayout } from "../layout/DefaultLayout"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
  })

  return <DefaultLayout>{children}</DefaultLayout>
}
