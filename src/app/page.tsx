import { invoke } from "./blitz-server"
import getCurrentUser from "./users/queries/getCurrentUser"

export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)
  return <div>FABELO </div>
}
