"use client";

import { deleteEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { ExternalLink, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CarteEvenement({ event, username, isPublic = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window?.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Réinitialiser après 2 secondes
    } catch (err) {
      console.error("Échec de la copie : ", err);
    }
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async () => {
    if (window?.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      await fnDeleteEvent(event.id);
      router.refresh();
    }
  };

  const handleCardClick = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "SVG") {
      window?.open(
        `${window?.location.origin}/${username}/${event.id}`,
        "_blank"
      );
    }
  };

  const getStatusBadge = () => {
    // Déterminer le statut en fonction des données de l'événement
    const status = event.isPrivate ? "Replanifié" : "En Cours";
    
    return (
      <span
        className={`px-2 py-1 text-xs rounded-md ${
          status === "En Cours"
            ? "bg-orange-100 text-[#F7B84B]"
            : status === "Terminé"
            ? "bg-green-100 text-green-500"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#5F9EE9] text-white rounded-full flex items-center justify-center font-medium">
            {event.title.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-[#2A3142]">{event.title}</CardTitle>
            <CardDescription className="text-sm text-[#808487]">
              {event.duration} mins | {event._count.bookings} Réservations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#808487]">
            {new Date().toLocaleDateString("fr-FR")}
          </span>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-[#2A3142]">
          {event.description.substring(0, event.description.indexOf("."))}.
        </p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center justify-center flex-1 text-sm border-[#5F9EE9] text-[#5F9EE9] hover:bg-[#5F9EE9] hover:text-white transition-colors duration-200 rounded-md"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isCopied ? "Copié !" : "Copier le lien"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center flex-1 text-sm bg-[#F7B84B] hover:bg-[#E9547B] text-white border-none transition-colors duration-200 rounded-md"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? "Suppression en cours..." : "Supprimer"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}