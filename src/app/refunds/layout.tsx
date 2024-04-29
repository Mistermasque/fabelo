import { useAuthenticatedBlitzContext } from "src/app/blitz-server"
import { PageLayout } from "app/components/layout/PageLayout"

export default async function Layout({ children }: { children: React.ReactNode }) {
  await useAuthenticatedBlitzContext({
    redirectTo: "/login",
  })

  return <PageLayout>{children}</PageLayout>
}
