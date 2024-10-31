import { Metadata } from "next"
import { Suspense } from "react"
import { invoke } from "src/app/blitz-server"
import getUser from "../queries/getUser"
import { UserView } from "../components/UserView"
import Loading from "app/loading"

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const user = await invoke(getUser, { id: Number(params.userId) })
  return {
    title: `Util. #${user.id}`,
    description: `Utilisateur ${user.name}`,
  }
}

type UserPageProps = {
  params: { userId: string }
}

export default async function Page({ params }: UserPageProps) {
  return (
    <Suspense fallback={Loading()}>
      <UserView userId={Number(params.userId)} />
    </Suspense>
  )
}
