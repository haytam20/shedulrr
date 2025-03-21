"use client";

import React, { useEffect } from "react";
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

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

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

  return (
    <div className="p-6 bg-gray-50">
      {/* Data update timestamp */}
      <div className="flex justify-between items-center mb-6">
        
        <div className="flex items-center text-sm text-gray-600">
          <span>Données actualisées le {format(new Date(), "dd/MM/yyyy à HH:mm")}</span>
          <button className="ml-2 text-gray-700 hover:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="border-l-4 border-orange-500 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <CardTitle>Welcome, {user?.firstName}!</CardTitle>
              
            </div>
          </CardHeader>
          <CardContent>
            {!loadingUpdates ? (
              <div className="space-y-6 font-light">
                <div>
                  {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-500 text-sm border-b">
                            <th className="pb-2 font-medium">Meeting</th>
                            <th className="pb-2 font-medium">Date</th>
                            <th className="pb-2 font-medium">With</th>
                            <th className="pb-2 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingMeetings?.map((meeting) => (
                            <tr key={meeting.id} className="border-b">
                              <td className="py-3">{meeting.event.title}</td>
                              <td className="py-3">{format(new Date(meeting.startTime), "MMM d, yyyy h:mm a")}</td>
                              <td className="py-3">{meeting.name}</td>
                              <td className="py-3">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                                  En Cours
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center p-6 text-center text-gray-500">
                      <div className="mb-4 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute -top-1 right-0 bg-orange-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                          <span className="text-lg font-bold">!</span>
                        </div>
                      </div>
                      <p>No upcoming meetings</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center p-4">
                <BarLoader color="#FF6600" width={150} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Your Unique Link</CardTitle>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Info
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <div className="flex items-center gap-2 border rounded-md p-2 bg-gray-50">
                  <span className="text-gray-600">{window?.location.origin}/</span>
                  <Input 
                    {...register("username")} 
                    placeholder="username" 
                    className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
                  />
                </div>
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error?.message}</p>
                )}
              </div>
              {loading && (
                <BarLoader className="mb-4" width={"100%"} color="#FF6600" />
              )}
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-orange-500 rounded-none text-white"
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