import { Metadata } from "next"
import { ResetPassword } from "../components/ResetPassword"

export const metadata: Metadata = {
  title: "Réinitialiser son mot de passe",
  description: "Réinitialiser son mot de passe FabElo",
}

export default function ResetPasswordPage() {
  return <ResetPassword />
}
