import "./styles/globals.css"
import { BlitzProvider } from "./blitz-client"
import Head from "next/head"

export const metadata = {
  title: { default: "Fabelo", template: "%s – Fabelo" },
  description: "Gestion des dépenses",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <body>
        <BlitzProvider>
          <>{children}</>
        </BlitzProvider>
      </body>
    </html>
  )
}
