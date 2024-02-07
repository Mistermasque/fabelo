import "./styles/globals.css"
import { BlitzProvider } from "./blitz-client"
import type { Viewport } from "next"

export const metadata = {
  title: { default: "Fabelo", template: "%s – Fabelo" },
  description: "Gestion des dépenses",
}

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <BlitzProvider>
          <>{children}</>
        </BlitzProvider>
      </body>
    </html>
  )
}
