"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBooking } from "@/actions/bookings";
import { bookingSchema } from "@/app/lib/validators";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  MessageSquare, 
  Video, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import "react-day-picker/style.css";
import useFetch from "@/hooks/use-fetch";

export default function BookingForm({ event, availability }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: "onChange",
  });

  const name = watch("name");
  const email = watch("email");

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  useEffect(() => {
    if (selectedTime) {
      setValue("time", selectedTime);
    }
  }, [selectedTime, setValue]);

  const { loading, data, fn: fnCreateBooking } = useFetch(createBooking);

  const onSubmit = async (data) => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    const startTime = new Date(
      `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}`
    );
    const endTime = new Date(startTime.getTime() + event.duration * 60000);

    const bookingData = {
      eventId: event.id,
      name: data.name,
      email: data.email,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      additionalInfo: data.additionalInfo,
    };

    await fnCreateBooking(bookingData);
  };

  const availableDays = availability.map((day) => new Date(day.date));

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  const nextStep = async () => {
    if (currentStep === 1 && selectedDate && selectedTime) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger(["name", "email"]);
      if (isValid) {
        handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  if (data) {
    return (
      <div className="relative overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl transition-all duration-300">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />
        
        <div className="relative text-center p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <Check className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Réservation confirmée!
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Votre réservation avec <span className="font-semibold text-blue-600 dark:text-blue-400">{event?.title}</span> a été enregistrée pour le{" "}
            {selectedDate && format(selectedDate, "dd/MM/yyyy")} à {selectedTime}.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600 p-6 rounded-xl shadow-sm mb-6">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nom</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{name || "Non spécifié"}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{email || "Non spécifié"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {data.meetLink && (
            <div className="mb-6">
              <p className="text-gray-900 dark:text-white mb-3 font-semibold">Lien pour rejoindre la réunion:</p>
              <a
                href={data.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <Video className="h-5 w-5" />
                Rejoindre la réunion
              </a>
            </div>
          )}
          
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 rounded-lg font-semibold py-3 px-8 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
          >
            Réserver un autre créneau
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
      
      {/* Header */}
      <div className="relative border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-semibold text-lg shadow-sm">
            {event?.title?.charAt(0)?.toUpperCase() || "E"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Planifier une réunion
            </h2>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              {event?.title} • {event?.duration} minutes
            </p>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center">
          <div className="flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
              currentStep >= 1 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md" 
                : "border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
            }`}>
              {currentStep > 1 ? <Check className="h-5 w-5" /> : "1"}
            </div>
            <span className={`ml-3 font-medium ${
              currentStep >= 1 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
            }`}>
              Date & Heure
            </span>
          </div>
          
          <div className={`flex-1 h-2 mx-6 rounded-full transition-all duration-300 ${
            currentStep > 1 
              ? "bg-gradient-to-r from-blue-500 to-blue-600" 
              : "bg-gray-200 dark:bg-gray-600"
          }`}></div>
          
          <div className="flex items-center">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-all duration-300 ${
              currentStep >= 2 
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md" 
                : "border-2 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500"
            }`}>
              {currentStep > 2 ? <Check className="h-5 w-5" /> : "2"}
            </div>
            <span className={`ml-3 font-medium ${
              currentStep >= 2 ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
            }`}>
              Vos informations
            </span>
          </div>
        </div>
      </div>
      
      <div className="relative p-6">
        {currentStep === 1 && (
          <div className="lg:flex gap-8">
            {/* Calendar Section */}
            <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sélectionnez une date</h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                  disabled={[{ before: new Date() }]}
                  modifiers={{ available: availableDays }}
                  modifiersStyles={{
                    available: {
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "white",
                      fontWeight: "600",
                      borderRadius: "8px",
                      transform: "scale(1.05)"
                    },
                    selected: {
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "white",
                      fontWeight: "600",
                      borderRadius: "8px"
                    }
                  }}
                  styles={{
                    caption: { 
                      color: "rgb(17 24 39 / var(--tw-text-opacity))", 
                      fontWeight: "600",
                      fontSize: "1.1rem"
                    },
                    day: { 
                      margin: "0.25em", 
                      borderRadius: "8px",
                      fontWeight: "500",
                      transition: "all 0.2s"
                    },
                    nav_button: { 
                      color: "#3b82f6",
                      borderRadius: "50%",
                      width: "2.5rem",
                      height: "2.5rem"
                    }
                  }}
                  classNames={{
                    day_selected: "bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold shadow-md",
                    day_today: "text-blue-600 dark:text-blue-400 font-bold border-2 border-blue-200 dark:border-blue-600",
                    nav_button: "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                  }}
                  footer={
                    <div className="text-sm text-center mt-4 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                      <span className="inline-block w-4 h-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md"></span>
                      Dates disponibles
                    </div>
                  }
                  components={{
                    IconLeft: () => <ChevronLeft className="h-5 w-5" />,
                    IconRight: () => <ChevronRight className="h-5 w-5" />
                  }}
                />
              </div>
            </div>
            
            {/* Time Slots Section */}
            <div className="w-full lg:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedDate 
                    ? `Créneaux pour le ${format(selectedDate, "dd/MM/yyyy")}`
                    : "Sélectionnez d'abord une date"}
                </h3>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-600 rounded-xl p-4 h-80 overflow-y-auto shadow-sm hover:shadow-md transition-shadow duration-200">
                {selectedDate ? (
                  timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-3 px-4 font-medium transition-all duration-200 rounded-lg transform hover:scale-105 active:scale-95 ${
                            selectedTime === slot 
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md border-0" 
                              : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-500"
                          }`}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                        <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Aucun créneau disponible</p>
                      <p className="text-sm text-center">Veuillez sélectionner une autre date</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Sélectionnez une date</p>
                    <p className="text-sm text-center">pour voir les créneaux disponibles</p>
                  </div>
                )}
              </div>
              
              {selectedDate && selectedTime && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {format(selectedDate, "dd/MM/yyyy")} à {selectedTime}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Créneau sélectionné</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vos informations</h3>
            </div>
            
            {/* Selected time summary */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedDate && format(selectedDate, "dd/MM/yyyy")} à {selectedTime}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event?.title}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-full">
                  {event?.duration} min
                </span>
              </div>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="h-5 w-5 text-blue-500" />
                    </div>
                    <Input 
                      id="name"
                      {...register("name")} 
                      placeholder="Votre nom complet" 
                      className="pl-11 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 rounded-lg shadow-sm"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="h-5 w-5 text-blue-500" />
                    </div>
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="votre@email.com"
                      className="pl-11 h-12 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 rounded-lg shadow-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Informations complémentaires <span className="text-gray-400 font-normal">(optionnel)</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                  </div>
                  <Textarea
                    id="additionalInfo"
                    {...register("additionalInfo")}
                    placeholder="Partagez toute information qui pourrait être utile pour la réunion..."
                    className="pl-11 pt-3 min-h-24 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 rounded-lg shadow-sm resize-none"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Footer Actions */}
        <div className="pt-6 mt-8 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            {currentStep === 2 && (
              <Button 
                onClick={prevStep} 
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg flex items-center gap-2 px-6 py-3 font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Button>
            )}
            
            <Button 
              onClick={nextStep} 
              disabled={loading || (currentStep === 1 && (!selectedDate || !selectedTime)) || (currentStep === 2 && (!name || !email))} 
              className={`${currentStep === 1 ? "ml-auto" : ""} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {currentStep === 1 ? (
                <>
                  Continuer
                  <ChevronRight className="h-4 w-4" />
                </>
              ) : loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1" />
                  Réservation en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Confirmer la réservation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}