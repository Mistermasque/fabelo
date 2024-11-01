import { Metadata } from "next"
import { Activate } from "../components/Activate"

export const metadata: Metadata = {
  title: "Activer son compte",
  description: "Activer son compte FabElo",
}

export default function ActivatePage() {
  return <Activate />
}
