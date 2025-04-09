import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="bg-white rounded shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto text-center">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-gray-500">404</span>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Page Non Trouvée
        </h1>
        
        <p className="text-gray-600 mb-8">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <Link href="/">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded font-medium inline-flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}