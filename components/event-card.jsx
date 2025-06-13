"use client";

import { deleteEvent } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Trash2, 
  User, 
  Check, 
  Eye,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CarteEvenement({ event, username, isPublic = false }) {
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      if (typeof window !== "undefined") {
        const url = `${window.location.origin}/${username}/${event.id}`;
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    await fnDeleteEvent(event.id);
    router.refresh();
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest("button") || 
      e.target.closest(".action-button") ||
      showDeleteConfirm
    ) {
      return;
    }
    
    if (typeof window !== "undefined") {
      window.open(
        `${window.location.origin}/${username}/${event.id}`,
        "_blank"
      );
    }
  };

  const getStatusInfo = () => {
    if (event.isPrivate) {
      return {
        status: "Privado",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        icon: <Eye className="h-3 w-3" />
      };
    }
    
    const hasActiveBookings = event._count?.bookings > 0;
    
    if (hasActiveBookings) {
      return {
        status: "Activo",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: <Check className="h-3 w-3" />
      };
    }
    
    return {
      status: "Disponible",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      icon: <Clock className="h-3 w-3" />
    };
  };

  const statusInfo = getStatusInfo();

  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div onClick={handleCardClick} className="relative">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Event Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-semibold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
                {event.title?.charAt(0)?.toUpperCase() || "E"}
              </div>
              
              {/* Event Info */}
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {event.title || "Evento sin título"}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{event.duration || 30} min</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <User className="h-4 w-4 text-blue-500" />
                    <span>{event._count?.bookings || 0} reservas</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <span 
              className={`${statusInfo.color} border-0 flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full`}
            >
              {statusInfo.icon}
              {statusInfo.status}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4 pb-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {event.description?.length > 120 
              ? `${event.description.substring(0, 120)}...`
              : event.description || "Sin descripción"}
          </p>
          
          {/* Metadata */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3" />
              <span>Creado el {formatDate(event.createdAt || new Date())}</span>
            </div>
            {!isPublic && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <ExternalLink className="h-3 w-3" />
                <span>Público</span>
              </div>
            )}
          </div>
        </CardContent>

        {!isPublic && (
          <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 pt-4 pb-4">
            {!showDeleteConfirm ? (
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={loading}
                  className="action-button flex-1 h-9 text-sm border-gray-300 dark:border-gray-600 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      ¡Copiado!
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Copiar enlace
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={loading}
                  className="action-button h-9 px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full space-y-3">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>¿Estás seguro de que quieres eliminar este evento?</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(false);
                    }}
                    className="action-button flex-1 h-9 text-sm"
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={loading}
                    className="action-button flex-1 h-9 text-sm bg-red-600 hover:bg-red-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        )}
      </div>
      
      {/* Copy notification */}
      {isCopied && (
        <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-lg text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          ¡Enlace copiado!
        </div>
      )}
    </Card>
  );
}