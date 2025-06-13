import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import TestimonialsCarousel from "@/components/testimonials";
import Link from "next/link";

const features = [
  {
    icon: Calendar,
    title: "Crear Capacitaciones",
    description: "Cree y personalice fácilmente sus tipos de eventos",
  },
  {
    icon: Clock,
    title: "Gestionar Disponibilidad",
    description: "Defina su disponibilidad para simplificar la planificación",
  },
  {
    icon: LinkIcon,
    title: "Enlaces Personalizados",
    description: "Comparta su enlace de planificación personalizado",
  },
];

const howItWorks = [
  { step: "Registro", description: "Cree su cuenta gratuita de Vista General" },
  {
    step: "Definir Disponibilidad",
    description: "Indique cuándo está disponible para reuniones",
  },
  {
    step: "Compartir Su Enlace",
    description: "Envíe su enlace a sus clientes o colegas",
  },
  {
    step: "Recibir Reservas",
    description: "Reciba automáticamente confirmaciones para nuevos citas",
  },
];

const Home = () => {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-600/10 to-white py-20 sm:py-24">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2A3142] mb-6">
                Simplifique Su Planificación
              </h1>
              <p className="text-[#5A5F63] text-lg sm:text-xl mb-8 leading-relaxed">
                Vista General le ayuda a gestionar su tiempo de manera eficiente. Cree eventos, defina
                su disponibilidad y permita que otros reserven tiempo con usted de forma transparente.
              </p>
              <Link href="/dashboard" passHref>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                  aria-label="Comenzar ahora"
                >
                  Comenzar <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3]">
                <Image
                  src="/poster.png"
                  alt="Ilustración de planificación"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 sm:py-20">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2A3142] mb-4">Funcionalidades Clave</h2>
            <p className="text-[#5A5F63] max-w-2xl mx-auto text-lg">
              Descubra cómo nuestra solución puede transformar su gestión del tiempo
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-[#2A3142] mb-2">{feature.title}</h3>
                <p className="text-[#5A5F63] text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/features" passHref>
              <Button
                className="bg-white text-blue-600 hover:bg-blue-600/10 border border-blue-600 rounded-lg px-6 py-3 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600/50"
                aria-label="Ver todas las funcionalidades"
              >
                Ver todas las funcionalidades
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#F7F9FB] py-16 sm:py-20">
        <div className="px-4 lg:px-8 mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2A3142] mb-4">Cómo Funciona</h2>
            <p className="text-[#5A5F63] max-w-2xl mx-auto text-lg">
              En solo 4 pasos simples, optimice su gestión de citas
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 text-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mx-auto text-white font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-lg font-semibold text-[#2A3142] mb-2">{step.step}</h3>
                <p className="text-[#5A5F63] text-sm sm:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;