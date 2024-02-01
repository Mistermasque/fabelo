import "./styles/globals.css"
import { BlitzProvider } from "./blitz-client"
import { Inter } from "next/font/google"
import Head from "next/head"

export const metadata = {
  title: { title: "Fabelo", template: "%s – Fabelo" },
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
