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

export default function EventCard({ event, username, isPublic = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window?.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async () => {
    if (window?.confirm("Are you sure you want to delete this event?")) {
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
    // Determine status based on event data
    const status = event.isPrivate ? "Replanifier" : "En Cours";
    
    return (
      <span
        className={`px-2 py-1 text-xs rounded-md ${
          status === "En Cours"
            ? "bg-orange-100 text-orange-500"
            : status === "Terminer"
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
      className="flex flex-col justify-between cursor-pointer border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            {event.title.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-xl font-medium text-gray-800">{event.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {event.duration} mins | {event._count.bookings} Bookings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString("fr-FR")}
          </span>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-700">
          {event.description.substring(0, event.description.indexOf("."))}.
        </p>
      </CardContent>
      {!isPublic && (
        <CardFooter className="flex gap-2 pt-2 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="flex items-center justify-center flex-1 text-sm border-gray-300 hover:bg-gray-50 rounded-none"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isCopied ? "Copied!" : "Copy Link"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center flex-1 text-sm bg-orange-500 hover:bg-orange-600 text-white border-none rounded-none"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}