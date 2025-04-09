import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Header from "@/components/header"
import CreateEventDrawer from "@/components/create-event"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Vue d'Ensemble",
  description: "Plateforme de gestion et planification de formations",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${inter.className} bg-gray-50 flex flex-col min-h-screen`}>
          <Header />
          <main className="flex-grow">{children}</main>
       
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  )
}

