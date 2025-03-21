import { Inter } from "next/font/google";
import Link from "next/link"; // Added Link import
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/header";
import CreateEventDrawer from "@/components/create-event";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Vue d'Ensemble",
  description: "Plateforme de gestion et planification de formations",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="fr">
        <body className={`${inter.className} bg-gray-50 min-h-screen`}>
          <Header />
          <main>
            {children}
          </main>
          <footer className="w-full bg-black text-white py-4">
            <div className="container mx-auto px-6 flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <span>© Orange 2025</span>
                <Link href="/accessibility" className="hover:underline">
                  Accessibility statement
                </Link>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </div>
              <div>
                <Link href="#" className="flex items-center hover:underline">
                  Link <span className="ml-1">↗</span>
                </Link>
              </div>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}