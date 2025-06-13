"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/app/lib/validators";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";
import { Copy, Check, RefreshCw, Calendar, Clock, User, Info, Link2 } from "lucide-react";

export default function PageDashboard() {
  const { user, isLoaded } = useUser();
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  // Watch the username field for copy functionality
  const username = watch("username");

  useEffect(() => {
    setValue("username", user?.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const {
    loading: loadingUpdates,
    data: upcomingMeetings,
    fn: fnUpdates,
  } = useFetch(getLatestUpdates);

  useEffect(() => {
    (async () => await fnUpdates())();
  }, []);

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    await fnUpdateUsername(data.username);
  };

  const copyToClipboard = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${baseUrl}/${username}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                ¡Bienvenido, {user?.firstName}!
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Gestiona tus eventos y reuniones desde tu tablero
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Actualizado el {format(new Date(), "dd/MM/yyyy 'a las' HH:mm")}</span>
              <button 
                onClick={() => fnUpdates()}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                disabled={loadingUpdates}
              >
                <RefreshCw className={`h-4 w-4 ${loadingUpdates ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Meetings Card */}
          <div className="lg:col-span-2">
            <Card className="h-full border-0 shadow-md bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Reuniones próximas
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {upcomingMeetings?.length || 0} reunión(es) programada(s)
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingUpdates ? (
                  <div className="flex justify-center py-8">
                    <BarLoader color="#3b82f6" width={100} />
                  </div>
                ) : upcomingMeetings && upcomingMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => (
                      <div 
                        key={meeting.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate">
                            {meeting.event.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(meeting.startTime), "MMM d, yyyy 'a las' h:mm a")}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>{meeting.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            En curso
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No hay reuniones próximas
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Tus próximas reuniones aparecerán aquí
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Unique Link Card */}
          <div className="lg:col-span-1">
            <Card className="h-full border-0 shadow-md bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Link2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tu enlace único
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Comparte este enlace con tus contactos
                      </p>
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre de usuario
                    </label>
                    <div className="relative">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-300 dark:border-gray-600">
                          {typeof window !== "undefined" ? new URL(window.location.origin).hostname : ""}/
                        </span>
                        <Input 
                          {...register("username")} 
                          placeholder="tu-nombre"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-gray-900 dark:text-white"
                        />
                        <button 
                          type="button"
                          onClick={copyToClipboard}
                          className="p-2 mr-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Copiar el enlace"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {copied && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                          ¡Enlace copiado!
                        </div>
                      )}
                      {errors.username && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {errors.username.message}
                        </p>
                      )}
                      {error && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {error?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {loading && (
                    <div className="py-2">
                      <BarLoader width="100%" color="#3b82f6" />
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Actualizando..." : "Actualizar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}