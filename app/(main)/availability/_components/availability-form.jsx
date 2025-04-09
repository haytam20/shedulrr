"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Clock, Calendar } from "lucide-react";

import { updateAvailability } from "@/actions/availability";
import { availabilitySchema } from "@/app/lib/validators";
import { timeSlots } from "../data";
import useFetch from "@/hooks/use-fetch";

export default function AvailabilityForm({ initialData }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    defaultValues: { ...initialData },
  });

  const {
    loading,
    error,
    fn: fnupdateAvailability,
  } = useFetch(updateAvailability);

  const onSubmit = async (data) => {
    await fnupdateAvailability(data);
  };

  const getDayLabel = (day) => {
    const days = {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    };
    return days[day] || day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-[#FFFFFF] dark:bg-[#2A3142] shadow-lg p-6 border border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-30">
        <h3 className="text-lg font-medium text-[#2A3142] dark:text-[#FFFFFF] mb-4">Disponibilités</h3>
        
        <div className="space-y-4">
          {[
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ].map((day) => {
            const isAvailable = watch(`${day}.isAvailable`);

            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 border-b border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-20">
                <div className="flex items-center gap-3 min-w-36">
                  <Controller
                    name={`${day}.isAvailable`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          setValue(`${day}.isAvailable`, checked);
                          if (!checked) {
                            setValue(`${day}.startTime`, "09:00");
                            setValue(`${day}.endTime`, "17:00");
                          }
                        }}
                        className="border-gray-300 dark:border-[#5F9EE9] data-[state=checked]:bg-[#5F9EE9] data-[state=checked]:hover:bg-[#4A8BD6] transition-colors duration-200"
                      />
                    )}
                  />
                  <span className="text-[#2A3142] dark:text-[#FFFFFF] font-medium">{getDayLabel(day)}</span>
                </div>
                
                {isAvailable && (
                  <div className="flex flex-wrap items-center gap-2 ml-0 sm:ml-4">
                    <div className="flex items-center border border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-30 bg-gray-50 dark:bg-[#2A3142] pr-2">
                      <Clock className="ml-2 h-4 w-4 text-[#808487]" />
                      <Controller
                        name={`${day}.startTime`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-24 border-0 bg-transparent focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#5F9EE9] text-[#2A3142] dark:text-[#FFFFFF]">
                              <SelectValue placeholder="Début" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#FFFFFF] dark:bg-[#2A3142] border-[#5F9EE9]">
                              {timeSlots.map((time) => (
                                <SelectItem 
                                  key={time} 
                                  value={time} 
                                  className="text-[#2A3142] dark:text-[#FFFFFF] hover:bg-[#5F9EE9] hover:bg-opacity-10 dark:hover:bg-opacity-20 transition-colors duration-200"
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    
                    <span className="text-[#808487]">à</span>
                    
                    <div className="flex items-center border border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-30 bg-gray-50 dark:bg-[#2A3142] pr-2">
                      <Clock className="ml-2 h-4 w-4 text-[#808487]" />
                      <Controller
                        name={`${day}.endTime`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-24 border-0 bg-transparent focus:ring-0 focus-visible:ring-2 focus-visible:ring-[#5F9EE9] text-[#2A3142] dark:text-[#FFFFFF]">
                              <SelectValue placeholder="Fin" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#FFFFFF] dark:bg-[#2A3142] border-[#5F9EE9]">
                              {timeSlots.map((time) => (
                                <SelectItem 
                                  key={time} 
                                  value={time} 
                                  className="text-[#2A3142] dark:text-[#FFFFFF] hover:bg-[#5F9EE9] hover:bg-opacity-10 dark:hover:bg-opacity-20 transition-colors duration-200"
                                >
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    
                    {errors[day]?.endTime && (
                      <span className="text-[#F06449] text-sm">
                        {errors[day].endTime.message}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-[#FFFFFF] dark:bg-[#2A3142] shadow-lg p-6 border border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-30">
        <h3 className="text-lg font-medium text-[#2A3142] dark:text-[#FFFFFF] mb-4">Paramètres</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#808487]" />
            <span className="text-[#2A3142] dark:text-[#FFFFFF]">Délai minimum avant réservation:</span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              min={0}
              type="number"
              {...register("timeGap", {
                valueAsNumber: true,
              })}
              className="w-24 border-gray-200 rounded-md dark:border-[#5F9EE9] dark:border-opacity-30 focus:border-[#5F9EE9] focus:ring-[#5F9EE9] dark:focus:ring-[#5F9EE9] bg-[#FFFFFF] dark:bg-[#2A3142] text-[#2A3142] dark:text-[#FFFFFF]"
            />
            <span className="text-[#808487]">minutes</span>
          </div>

          {errors.timeGap && (
            <span className="text-[#F06449] text-sm">{errors.timeGap.message}</span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-[#F06449] bg-opacity-10 text-[#F06449] p-3 text-sm">
          {error?.message}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white font-medium px-6 transition-colors duration-200 focus:ring-2 focus:ring-[#5F9EE9] focus:ring-opacity-50 active:scale-95"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}