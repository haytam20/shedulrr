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
      <div className="bg-white rounded-none shadow-sm p-6 border border-gray-200"> {/* Removed rounded-lg */}
        <h3 className="text-lg font-medium text-gray-800 mb-4">Disponibilités</h3>
        
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
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 pb-3 border-b border-gray-100">
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
                        className="border-gray-300 data-[state=checked]:bg-orange-500 rounded-none" // Removed rounded-md
                      />
                    )}
                  />
                  <span className="text-gray-700 font-medium">{getDayLabel(day)}</span>
                </div>
                
                {isAvailable && (
                  <div className="flex flex-wrap items-center gap-2 ml-0 sm:ml-4">
                    <div className="flex items-center border rounded-none bg-gray-50 pr-2"> {/* Removed rounded-md */}
                      <Clock className="ml-2 h-4 w-4 text-gray-400" />
                      <Controller
                        name={`${day}.startTime`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-24 border-0 bg-transparent focus:ring-0 rounded-none"> {/* Removed rounded-md */}
                              <SelectValue placeholder="Début" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none"> {/* Removed rounded-md */}
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="rounded-none"> {/* Removed rounded-md */}
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    
                    <span className="text-gray-500">à</span>
                    
                    <div className="flex items-center border rounded-none bg-gray-50 pr-2"> {/* Removed rounded-md */}
                      <Clock className="ml-2 h-4 w-4 text-gray-400" />
                      <Controller
                        name={`${day}.endTime`}
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-24 border-0 bg-transparent focus:ring-0 rounded-none"> {/* Removed rounded-md */}
                              <SelectValue placeholder="Fin" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none"> {/* Removed rounded-md */}
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time} className="rounded-none"> {/* Removed rounded-md */}
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    
                    {errors[day]?.endTime && (
                      <span className="text-red-500 text-sm">
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

      <div className="bg-white rounded-none shadow-sm p-6 border border-gray-200"> {/* Removed rounded-lg */}
        <h3 className="text-lg font-medium text-gray-800 mb-4">Paramètres</h3>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-gray-700">Délai minimum avant réservation:</span>
          </div>

          <div className="flex items-center gap-2">
            <Input
              min={0}
              type="number"
              {...register("timeGap", {
                valueAsNumber: true,
              })}
              className="w-24 border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-none" // Removed rounded-md
            />
            <span className="text-gray-500">minutes</span>
          </div>

          {errors.timeGap && (
            <span className="text-red-500 text-sm">{errors.timeGap.message}</span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-none text-sm"> {/* Removed rounded-md */}
          {error?.message}
        </div>
      )}
      
      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 rounded-none" // Removed rounded-md
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </form>
  );
}