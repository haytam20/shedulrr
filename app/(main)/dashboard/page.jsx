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
import { Copy, Check, RefreshCw } from "lucide-react";

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
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${baseUrl}/${username}`;
    
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="p-3 md:p-6 bg-[#FFFFFF] dark:bg-[#2A3142]">
      {/* Data update timestamp */}
      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center text-xs sm:text-sm text-[#808487]">
          <span>Données actualisées le {format(new Date(), "dd/MM/yyyy à HH:mm")}</span>
          <button className="ml-2 text-[#2A3142] dark:text-[#FFFFFF] hover:text-[#5F9EE9] dark:hover:text-[#5F9EE9] transition-colors duration-200">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <Card className="border-l-4 border-[#5F9EE9] shadow-lg bg-[#FFFFFF] dark:bg-[#2A3142] dark:text-[#FFFFFF] rounded-lg">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <div className="flex items-center">
              <CardTitle className="text-lg md:text-xl text-[#2A3142] dark:text-[#FFFFFF]">Bienvenue, {user?.firstName} !</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {!loadingUpdates ? (
              <div className="space-y-4 md:space-y-6 font-medium">
                <div>
                  {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-[#808487] text-xs sm:text-sm border-b border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-20">
                            <th className="pb-2 pl-3 sm:pl-0 font-medium">Réunion</th>
                            <th className="pb-2 font-medium hidden sm:table-cell">Date</th>
                            <th className="pb-2 font-medium hidden md:table-cell">Avec</th>
                            <th className="pb-2 pr-3 sm:pr-0 font-medium">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingMeetings?.map((meeting) => (
                            <tr key={meeting.id} className="border-b border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-20">
                              <td className="py-3 pl-3 sm:pl-0 text-xs sm:text-sm text-[#2A3142] dark:text-[#FFFFFF]">{meeting.event.title}</td>
                              <td className="py-3 text-xs sm:text-sm hidden sm:table-cell text-[#2A3142] dark:text-[#FFFFFF]">{format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")}</td>
                              <td className="py-3 text-xs sm:text-sm hidden md:table-cell text-[#2A3142] dark:text-[#FFFFFF]">{meeting.name}</td>
                              <td className="py-3 pr-3 sm:pr-0">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#F7B84B] bg-opacity-20 text-[#F7B84B]">
                                  En Cours
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Additional details for hidden columns on mobile */}
                      <div className="sm:hidden space-y-2 mt-2">
                        {upcomingMeetings?.map((meeting) => (
                          <div key={`mobile-${meeting.id}`} className="text-xs px-3 text-[#808487]">
                            <div><span className="font-medium">Date:</span> {format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")}</div>
                            <div><span className="font-medium">Avec:</span> {meeting.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-3 sm:p-6 text-center text-[#808487]">
                      <div className="mb-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 dark:text-[#5F9EE9] dark:text-opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute -top-1 right-0 bg-[#E9547B] text-white rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                          <span className="text-base sm:text-lg font-bold">!</span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base dark:text-[#FFFFFF]">Aucune réunion à venir</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <BarLoader color="#5F9EE9" width={100} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Card for Unique Link */}
        <Card className="shadow-lg bg-[#FFFFFF] dark:bg-[#2A3142] dark:text-[#FFFFFF] rounded-lg">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-medium text-[#2A3142] dark:text-[#FFFFFF]">Votre Lien Unique</CardTitle>
              <button className="px-3 py-1 text-xs sm:text-sm bg-[#F7B84B] text-[#2A3142] rounded-md hover:bg-[#F7B84B] hover:bg-opacity-80 transition-colors duration-200">
                Info
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 border border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-30 rounded-md p-2 bg-gray-50 dark:bg-[#2A3142]">
                  <span className="text-xs sm:text-sm text-[#808487] truncate max-w-full sm:max-w-fit">
                    {typeof window !== 'undefined' ? window.location.origin : ''}
                  </span>
                  <Input 
                    {...register("username")} 
                    placeholder="nom d'utilisateur" 
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-xs sm:text-sm bg-transparent text-[#2A3142] dark:text-[#FFFFFF]"
                  />
                  <button 
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1 ml-auto text-[#808487] hover:text-[#5F9EE9] rounded-md hover:bg-gray-100 dark:hover:bg-[#2A3142] transition-colors duration-200"
                    aria-label="Copier le lien"
                  >
                    {copied ? <Check size={16} className="text-[#5F9EE9]" /> : <Copy size={16} />}
                  </button>
                </div>
                {errors.username && (
                  <p className="text-[#F06449] text-xs sm:text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
                {error && (
                  <p className="text-[#F06449] text-xs sm:text-sm mt-1">{error?.message}</p>
                )}
              </div>
              {loading && (
                <BarLoader className="mb-4" width={"100%"} color="#5F9EE9" />
              )}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white text-xs sm:text-sm rounded-md transition-colors duration-200 focus:ring-2 focus:ring-[#5F9EE9] focus:ring-opacity-50 active:scale-95"
              >
                Mettre à jour le nom d'utilisateur
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
