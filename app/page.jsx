import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import TestimonialsCarousel from "@/components/testimonials";
import Link from "next/link";

const features = [
  {
    icon: Calendar,
    title: "Créer des Formations",
    description: "Créez et personnalisez facilement vos types d'événements",
  },
  {
    icon: Clock,
    title: "Gérer la Disponibilité",
    description: "Définissez votre disponibilité pour simplifier la planification",
  },
  {
    icon: LinkIcon,
    title: "Liens Personnalisés",
    description: "Partagez votre lien de planification personnalisé",
  },
];

const howItWorks = [
  { step: "Inscription", description: "Créez votre compte Vue d'Ensemble gratuit" },
  {
    step: "Définir la Disponibilité",
    description: "Indiquez quand vous êtes disponible pour des réunions",
  },
  {
    step: "Partager Votre Lien",
    description: "Envoyez votre lien à vos clients ou collègues",
  },
  {
    step: "Recevoir des Réservations",
    description: "Recevez automatiquement des confirmations pour les nouveaux rendez-vous",
  },
];

const Home = () => {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-12">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Simplifiez Votre Planification
              </h1>
              <p className="text-gray-600 mb-8">
                Vue d'Ensemble vous aide à gérer votre temps efficacement. Créez des événements, définissez
                votre disponibilité et permettez aux autres de réserver du temps avec vous en toute transparence.
              </p>
              <Link href="/dashboard">
                <Button className="bg-gray-900 hover:bg-orange-500 text-white rounded-none px-4 py-2 font-medium">
                  Commencer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/poster.png"
                  alt="Illustration de planification"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-12">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Fonctionnalités Clés</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium">
              Découvrir
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="border border-gray-200 p-4">
                <div className="flex items-start mb-3">
                  <feature.icon className="w-5 h-5 text-gray-500 mr-3 mt-1" />
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-12">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Comment Ça Marche</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium">
              Découvrir
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div key={index} className="border border-gray-200 p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-100 w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-gray-700 font-medium">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{step.step}</h3>
                </div>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-12">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Évaluations</h2>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-sm font-medium">
              Découvrir
            </button>
          </div>
          <TestimonialsCarousel />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white shadow-sm border-b border-gray-200 py-12">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Prêt à Simplifier Votre Planification?
          </h2>
          <p className="text-gray-600 mb-6">
            Rejoignez des milliers de professionnels qui font confiance à Vue d'Ensemble pour une gestion efficace du temps.
          </p>
          <Link href="/dashboard">
            <Button className="bg-orange-500 hover:bg-orange-600 rounded-none text-white px-6 py-3 font-medium">
              Commencer Gratuitement <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;