"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, Settings, CheckCircle2, AlertCircle, Loader2, Save } from "lucide-react";

import { updateAvailability } from "@/actions/availability";
import { availabilitySchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00",
  "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00",
];

export default function AvailabilityForm({ initialData }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
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
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
      sunday: "Domingo",
    };
    return days[day] || day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getDayIcon = (day) => {
    const dayIcons = {
      monday: "Lu",
      tuesday: "Ma",
      wednesday: "Mi",
      thursday: "Ju",
      friday: "Vi",
      saturday: "Sá",
      sunday: "Do",
    };
    return dayIcons[day] || day.charAt(0).toUpperCase();
  };

  const availableDays = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  ].filter((day) => watch(`${day}.isAvailable`)).length;

  const totalHours = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  ].reduce((total, day) => {
    if (watch(`${day}.isAvailable`)) {
      const start = watch(`${day}.startTime`);
      const end = watch(`${day}.endTime`);
      if (start && end) {
        const startTime = new Date(`2000-01-01 ${start}`);
        const endTime = new Date(`2000-01-01 ${end}`);
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        return total + (hours > 0 ? hours : 0);
      }
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Configuración de Disponibilidad
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Define tus horarios de trabajo y las reglas de reserva para optimizar tu calendario
            </p>
          </div>

          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{availableDays}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Días activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalHours.toFixed(1)}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Horas/semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{watch("timeGap") || 0}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Min anticipación</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isDirty 
                      ? "bg-amber-500/10" 
                      : "bg-green-500/10"
                  }`}>
                    {isDirty ? (
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {isDirty ? "Pendiente" : "Guardado"}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {isDirty ? "Cambios sin guardar" : "Todo actualizado"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Availability */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Horarios Semanales
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Activa los días y define tus horarios de disponibilidad
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
                ].map((day) => {
                  const isAvailable = watch(`${day}.isAvailable`);
                  const hasError = errors[day]?.endTime;

                  return (
                    <div
                      key={day}
                      className={`group relative rounded-xl border-2 transition-all duration-300 ease-out ${
                        isAvailable
                          ? "border-blue-200 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                      } ${hasError ? "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10" : ""}`}
                    >
                      <div className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Day Header */}
                          <div className="flex items-center gap-4 min-w-fit">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${
                                isAvailable
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200 dark:shadow-blue-900/50"
                                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                              }`}
                            >
                              {getDayIcon(day)}
                            </div>

                            <div className="flex items-center gap-3">
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
                                    className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 transition-all duration-200"
                                  />
                                )}
                              />
                              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                                {getDayLabel(day)}
                              </span>
                            </div>
                          </div>

                          {/* Time Configuration */}
                          {isAvailable && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 animate-in slide-in-from-top-2 duration-300">
                              <div className="flex items-center gap-3 flex-wrap">
                                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 shadow-sm hover:shadow transition-all duration-200 min-w-fit">
                                  <Clock className="h-4 w-4 text-slate-500" />
                                  <Controller
                                    name={`${day}.startTime`}
                                    control={control}
                                    render={({ field }) => (
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-auto border-0 bg-transparent focus:ring-0 p-0 h-auto text-slate-900 dark:text-white font-semibold">
                                          <SelectValue placeholder="Inicio" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg">
                                          {timeSlots.map((time) => (
                                            <SelectItem
                                              key={time}
                                              value={time}
                                              className="text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 transition-colors duration-150 rounded-md"
                                            >
                                              {time}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                </div>

                                <div className="flex items-center">
                                  <div className="w-8 h-0.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                                </div>

                                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2.5 shadow-sm hover:shadow transition-all duration-200 min-w-fit">
                                  <Clock className="h-4 w-4 text-slate-500" />
                                  <Controller
                                    name={`${day}.endTime`}
                                    control={control}
                                    render={({ field }) => (
                                      <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-auto border-0 bg-transparent focus:ring-0 p-0 h-auto text-slate-900 dark:text-white font-semibold">
                                          <SelectValue placeholder="Fin" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg">
                                          {timeSlots.map((time) => (
                                            <SelectItem
                                              key={time}
                                              value={time}
                                              className="text-slate-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:bg-blue-50 dark:focus:bg-blue-900/20 transition-colors duration-150 rounded-md"
                                            >
                                              {time}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                </div>
                              </div>

                              {hasError && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium animate-in slide-in-from-right-2 duration-200">
                                  <AlertCircle className="h-4 w-4" />
                                  {errors[day].endTime.message}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Booking Settings */}
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    Configuración de Reservas
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    Define las reglas para las reservas de citas
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Tiempo mínimo de anticipación
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Tiempo requerido entre la reserva y la cita programada
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3 shadow-sm hover:shadow transition-all duration-200">
                      <Input
                        min={0}
                        max={1440}
                        type="number"
                        {...register("timeGap", {
                          valueAsNumber: true,
                        })}
                        className="w-20 border-0 bg-transparent focus:ring-0 p-0 text-center text-xl font-bold text-slate-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">minutos</span>
                    </div>

                    {errors.timeGap && (
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        {errors.timeGap.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="border-0 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-semibold">Error al actualizar configuración</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">{error?.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <div className="flex-1">
              {isDirty && (
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium animate-in slide-in-from-left-2 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  Tienes cambios sin guardar
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || loading}
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Cancelar
              </Button>
              
              <Button
                type="submit"
                disabled={loading || !isDirty}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-2 min-w-fit"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}