import { Inter } from "next/font/google";
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
          <footer className="border-t border-gray-200 bg-white py-4 mt-8">
            <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
              <p>© 2025. Tous droits réservés.</p>
            </div>
          </footer>
          <CreateEventDrawer />
        </body>
      </html>
    </ClerkProvider>
  );
}