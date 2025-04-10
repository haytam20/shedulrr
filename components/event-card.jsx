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
import { Calendar, ExternalLink, Trash2 } from "lucide-react";
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
      setTimeout(() => setIsCopied(false), 2000);
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
    // Avoid triggering card click when clicking buttons or their children
    if (
      e.target.tagName !== "BUTTON" && 
      e.target.tagName !== "SVG" && 
      !e.target.closest('button')
    ) {
      window?.open(
        `${window?.location.origin}/${username}/${event.id}`,
        "_blank"
      );
    }
  };

  const getStatusBadge = () => {
    let status, bgColor, textColor;
    
    if (event.isPrivate) {
      status = "Replanifié";
      bgColor = "bg-gray-100";
      textColor = "text-gray-500";
    } else if (event._count.bookings > 0) {
      status = "En Cours";
      bgColor = "bg-orange-100";
      textColor = "text-[#F7B84B]";
    } else {
      status = "Disponible";
      bgColor = "bg-green-100";
      textColor = "text-green-500";
    }
    
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-md ${bgColor} ${textColor}`}
      >
        {status}
      </span>
    );
  };

  // Function to format the truncated description
  const getTruncatedDescription = () => {
    const firstSentenceEnd = event.description.indexOf(".");
    if (firstSentenceEnd === -1) {
      return event.description.length > 100 
        ? event.description.substring(0, 100) + "..." 
        : event.description;
    }
    return event.description.substring(0, firstSentenceEnd + 1);
  };

  return (
    <Card
      className="flex flex-col justify-between cursor-pointer border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#5F9EE9] text-white rounded-full flex items-center justify-center font-semibold text-lg transition-colors duration-200 hover:bg-[#4A8BD6]">
            {event.title.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-[#2A3142]">{event.title}</CardTitle>
            <CardDescription className="text-sm text-[#808487] flex items-center gap-1">
              <span>{event.duration} mins</span>
              <span className="mx-1">•</span>
              <span>{event._count.bookings} Réservation{event._count.bookings !== 1 ? 's' : ''}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-[#808487] flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("fr-FR", {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-[#2A3142] line-clamp-2">
          {getTruncatedDescription()}
        </p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex gap-2 pt-3 border-t border-gray-200">
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
            {loading ? "Suppression..." : "Supprimer"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}