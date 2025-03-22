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
import { Copy, Check } from "lucide-react";

export default function DashboardPage() {
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
    <div className="p-3 md:p-6 bg-gray-50">
      {/* Data update timestamp */}
      <div className="flex flex-wrap justify-between items-center mb-4 md:mb-6">
        <div className="flex items-center text-xs sm:text-sm text-gray-600">
          <span>Données actualisées le {format(new Date(), "dd/MM/yyyy à HH:mm")}</span>
          <button className="ml-2 text-gray-700 hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4 md:space-y-8">
        <Card className="border-l-4 border-orange-500 shadow-sm">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <div className="flex items-center">
              <CardTitle className="text-lg md:text-xl">Welcome, {user?.firstName}!</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {!loadingUpdates ? (
              <div className="space-y-4 md:space-y-6 font-light">
                <div>
                  {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-500 text-xs sm:text-sm border-b">
                            <th className="pb-2 pl-3 sm:pl-0 font-medium">Meeting</th>
                            <th className="pb-2 font-medium hidden sm:table-cell">Date</th>
                            <th className="pb-2 font-medium hidden md:table-cell">With</th>
                            <th className="pb-2 pr-3 sm:pr-0 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingMeetings?.map((meeting) => (
                            <tr key={meeting.id} className="border-b">
                              <td className="py-3 pl-3 sm:pl-0 text-xs sm:text-sm">{meeting.event.title}</td>
                              <td className="py-3 text-xs sm:text-sm hidden sm:table-cell">{format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")}</td>
                              <td className="py-3 text-xs sm:text-sm hidden md:table-cell">{meeting.name}</td>
                              <td className="py-3 pr-3 sm:pr-0">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                  En Cours
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Mobile-only row details for hidden columns */}
                      <div className="sm:hidden space-y-2 mt-2">
                        {upcomingMeetings?.map((meeting) => (
                          <div key={`mobile-${meeting.id}`} className="text-xs px-3 text-gray-500">
                            <div><span className="font-medium">Date:</span> {format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")}</div>
                            <div><span className="font-medium">With:</span> {meeting.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-3 sm:p-6 text-center text-gray-500">
                      <div className="mb-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute -top-1 right-0 bg-orange-500 text-white rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                          <span className="text-base sm:text-lg font-bold">!</span>
                        </div>
                      </div>
                      <p className="text-sm sm:text-base">No upcoming meetings</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <BarLoader color="#FF6600" width={100} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <CardTitle className="text-base sm:text-lg font-medium">Your Unique Link</CardTitle>
              <button className="px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Info
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 border rounded-md p-2 bg-gray-50">
                  <span className="text-xs sm:text-sm text-gray-600 truncate max-w-full sm:max-w-fit">
                    {typeof window !== 'undefined' ? window.location.origin : ''}/
                  </span>
                  <Input 
                    {...register("username")} 
                    placeholder="username" 
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-xs sm:text-sm"
                  />
                  <button 
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1 ml-auto text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="Copy link"
                  >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{error?.message}</p>
                )}
              </div>
              {loading && (
                <BarLoader className="mb-4" width={"100%"} color="#FF6600" />
              )}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-orange-500 rounded-none text-white text-xs sm:text-sm"
              >
                Update Username
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}