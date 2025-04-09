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
          <footer className="w-full bg-black text-white py-6 mt-auto">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <span className="text-sm">© Orange 2025</span>
                  <div className="flex flex-wrap gap-4 md:gap-8">
                    <Link href="/accessibility" className="text-sm hover:underline transition-colors">
                      Accessibility statement
                    </Link>
                    <Link href="/contact" className="text-sm hover:underline transition-colors">
                      Contact
                    </Link>
                  </div>
                </div>
                <div>
                  <Link href="#" className="flex items-center text-sm hover:underline transition-colors group">
                    Link <span className="ml-1 group-hover:translate-x-0.5 transition-transform">↗</span>
                  </Link>
                </div>
              </div>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  )
}

