import { Metadata } from "next"
import { ResetActivation } from "../components/ResetActivation"

export const metadata: Metadata = {
  title: "Activer son compte",
  description: "Activer son compte FabElo",
}

export default function ResetActivationPage() {
  return <ResetActivation />
}
