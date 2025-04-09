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
    <main className="bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#5F9EE9]/10 to-white py-16">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-bold text-[#2A3142] mb-4">
                Simplifiez Votre Planification
              </h1>
              <p className="text-[#808487] text-lg mb-8">
                Vue d'Ensemble vous aide à gérer votre temps efficacement. Créez des événements, définissez
                votre disponibilité et permettez aux autres de réserver du temps avec vous en toute transparence.
              </p>
              <Link href="/dashboard" passHref>
                <Button className="bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white rounded-lg px-6 py-3 font-medium transition-colors duration-200">
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
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A3142] mb-4">Fonctionnalités Clés</h2>
            <p className="text-[#808487] max-w-2xl mx-auto">
              Découvrez comment notre solution peut transformer votre gestion du temps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-[#5F9EE9]/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#5F9EE9]" />
                </div>
                <h3 className="text-xl font-semibold text-[#2A3142] mb-2">{feature.title}</h3>
                <p className="text-[#808487]">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/features" passHref>
              <Button className="bg-white text-[#5F9EE9] hover:bg-[#5F9EE9]/10 border border-[#5F9EE9] rounded-lg px-6 py-3 font-medium transition-colors duration-200">
                Voir toutes les fonctionnalités
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#F7F9FB] py-16">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2A3142] mb-4">Comment Ça Marche</h2>
            <p className="text-[#808487] max-w-2xl mx-auto">
              En seulement 4 étapes simples, optimisez votre gestion de rendez-vous
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-10 h-10 rounded-full bg-[#5F9EE9] flex items-center justify-center text-white font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-[#2A3142] mb-2">{step.step}</h3>
                <p className="text-[#808487] text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;