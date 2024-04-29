import { useAuthenticatedBlitzContext } from "../blitz-server"
import { AuthLayout } from "app/components/layout/AuthLayout"

export default async function Layout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectAuthenticatedTo: "/",
  })
  return <AuthLayout>{children}</AuthLayout>
}
