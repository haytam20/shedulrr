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
import { Calendar, Clock, ExternalLink, Trash2, User, Check } from "lucide-react";
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
    // Ensure we're not triggering navigation when clicking buttons or icons
    if (
      !e.target.closest("button") && 
      e.target.tagName !== "BUTTON" && 
      e.target.tagName !== "SVG"
    ) {
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
        className={`px-2 py-1 text-xs rounded-md inline-flex items-center gap-1 ${
          status === "En Cours"
            ? "bg-[#F7B84B] bg-opacity-15 text-[#F7B84B] border border-[#F7B84B] border-opacity-20"
            : status === "Terminé"
            ? "bg-[#5F9EE9] bg-opacity-15 text-[#5F9EE9] border border-[#5F9EE9] border-opacity-20"
            : "bg-[#2A3142] bg-opacity-10 text-[#808487] border border-[#808487] border-opacity-20"
        }`}
      >
        {status === "En Cours" && <Clock className="h-3 w-3" />}
        {status === "Terminé" && <Check className="h-3 w-3" />}
        {status}
      </span>
    );
  };

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer border border-[#5F9EE9] border-opacity-20 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-102 active:scale-98 bg-white overflow-hidden"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2 border-b border-[#5F9EE9] border-opacity-10 bg-[#5F9EE9] bg-opacity-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#5F9EE9] text-white rounded-full flex items-center justify-center font-medium shadow-sm transition-transform duration-300 hover:scale-105">
            {event.title.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[#2A3142]">{event.title}</CardTitle>
            <CardDescription className="text-sm text-[#808487] flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-[#5F9EE9]" />
                {event.duration} mins
              </div>
              <span className="text-[#5F9EE9] text-opacity-50">|</span>
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-[#5F9EE9]" />
                {event._count.bookings} Réservations
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-[#808487] flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#5F9EE9]" />
            {new Date().toLocaleDateString("fr-FR")}
          </span>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-[#2A3142] line-clamp-2">
          {event.description.substring(0, event.description.indexOf(".") + 1)}
        </p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex gap-2 pt-3 pb-3 border-t border-[#5F9EE9] border-opacity-10 bg-[#5F9EE9] bg-opacity-5">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center justify-center flex-1 text-sm border border-[#5F9EE9] border-opacity-40 text-[#5F9EE9] hover:bg-[#5F9EE9] hover:bg-opacity-10 hover:text-[#4A8BD6] transition-all duration-200 rounded-md"
          >
            {isCopied ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Copié !
              </>
            ) : (
              <>
                <ExternalLink className="mr-1 h-4 w-4" />
                Copier le lien
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className={`flex items-center justify-center flex-1 text-sm ${
              loading 
                ? "bg-[#E9547B] bg-opacity-70" 
                : "bg-[#F7B84B] hover:bg-[#E9547B]"
            } text-white border-none transition-all duration-200 rounded-md`}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}