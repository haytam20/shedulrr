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
import { Calendar, Clock, User, Mail, MessageSquare, Video, Check, ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="text-center p-6 border border-[#5F9EE9] bg-white shadow-lg rounded-lg transition-all duration-300"> 
        <div className="w-16 h-16 bg-[#5F9EE9] bg-opacity-20 flex items-center justify-center mx-auto mb-4 rounded-full transition-transform duration-300 hover:scale-105"> 
          <Check className="h-8 w-8 text-[#5F9EE9]" />
        </div>
        <h2 className="text-xl font-semibold text-[#2A3142] mb-3">Réservation confirmée!</h2>
        <p className="text-[#808487] mb-4">
          Votre réservation avec {event?.title} a été enregistrée pour le{" "}
          {selectedDate && format(selectedDate, "dd/MM/yyyy")} à {selectedTime}.
        </p>
        <div className="bg-[#5F9EE9] bg-opacity-5 p-4 my-4 border border-[#5F9EE9] border-opacity-20 text-left rounded-lg shadow-sm"> 
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-[#5F9EE9]" />
            <p className="text-[#2A3142]">{name || "Non spécifié"}</p>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-[#5F9EE9]" />
            <p className="text-[#2A3142]">{email || "Non spécifié"}</p>
          </div>
        </div>
        {data.meetLink && (
          <div className="mt-6">
            <p className="text-[#2A3142] mb-2 font-medium">Lien pour rejoindre la réunion:</p>
            <a
              href={data.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#5F9EE9] bg-opacity-10 border border-[#5F9EE9] border-opacity-30 rounded-lg text-[#5F9EE9] hover:bg-opacity-20 transition-all duration-200"
            >
              <Video className="h-4 w-4" />
              Rejoindre la réunion
            </a>
          </div>
        )}
        <Button 
          onClick={() => window.location.reload()}
          className="mt-6 bg-[#F7B84B] text-white hover:bg-[#F7B84B] hover:bg-opacity-80 transition-all duration-200 rounded-md font-medium py-2 px-6 hover:scale-105 active:scale-95 shadow-sm" 
        >
          Réserver un autre créneau
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-[#5F9EE9] border-opacity-30 bg-white shadow-lg overflow-hidden rounded-lg transition-all duration-200"> 
      <div className="bg-[#5F9EE9] bg-opacity-10 p-4 border-b border-[#5F9EE9] border-opacity-20">
        <h2 className="text-lg font-semibold text-[#2A3142] flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#5F9EE9]" />
          Planifier une réunion: {event?.title}
        </h2>
        <p className="text-[#808487] text-sm mt-1 flex items-center gap-1">
          <Clock className="h-4 w-4" />
          Durée: {event?.duration} minutes
        </p>
        
        {/* Progress indicator */}
        <div className="flex items-center mt-6">
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep >= 1 ? "bg-[#5F9EE9] text-white" : "border-2 border-[#5F9EE9] border-opacity-40 text-[#5F9EE9]"
            } transition-all duration-300`}>
              {currentStep > 1 ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? "text-[#2A3142]" : "text-[#808487]"}`}>
              Date & Heure
            </span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${currentStep > 1 ? "bg-[#5F9EE9]" : "bg-[#5F9EE9] bg-opacity-20"} transition-all duration-300`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentStep >= 2 ? "bg-[#5F9EE9] text-white" : "border-2 border-[#5F9EE9] border-opacity-40 text-[#5F9EE9]"
            } transition-all duration-300`}>
              {currentStep > 2 ? <Check className="h-4 w-4" /> : "2"}
            </div>
            <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? "text-[#2A3142]" : "text-[#808487]"}`}>
              Vos informations
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-4 pb-6">
        {currentStep === 1 && (
          <div className="md:flex gap-8">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[#5F9EE9]" />
                <h3 className="text-sm font-medium text-[#2A3142]">Sélectionnez une date</h3>
              </div>
              <div className="border border-[#5F9EE9] border-opacity-20 p-3 bg-white shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"> 
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
                      background: "#F7B84B",
                      color: "#2A3142",
                      fontWeight: "bold",
                      borderRadius: "4px"
                    },
                    selected: {
                      background: "#5F9EE9",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "4px"
                    }
                  }}
                  styles={{
                    caption: { color: "#2A3142", fontWeight: "500" },
                    day: { margin: "0.2em", borderRadius: "4px" },
                    nav_button: { color: "#5F9EE9" }
                  }}
                  classNames={{
                    day_selected: "bg-[#5F9EE9] text-white font-medium",
                    day_today: "text-[#5F9EE9] font-bold border border-[#5F9EE9] border-opacity-50",
                    nav_button: "text-[#5F9EE9] hover:bg-[#5F9EE9] hover:bg-opacity-10 rounded-full"
                  }}
                  footer={
                    <div className="text-xs text-center mt-3 flex items-center justify-center gap-2 text-[#808487]">
                      <span className="inline-block w-3 h-3 bg-[#F7B84B] rounded-sm"></span>
                      Dates disponibles
                    </div>
                  }
                  components={{
                    IconLeft: () => <ChevronLeft className="h-4 w-4 text-[#5F9EE9]" />,
                    IconRight: () => <ChevronRight className="h-4 w-4 text-[#5F9EE9]" />
                  }}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-[#5F9EE9]" />
                <h3 className="text-sm font-medium text-[#2A3142]">
                  {selectedDate 
                    ? `Créneaux disponibles pour le ${format(selectedDate, "dd/MM/yyyy")}`
                    : "Sélectionnez d'abord une date"}
                </h3>
              </div>
              
              <div className="border border-[#5F9EE9] border-opacity-20 p-4 bg-white h-72 overflow-y-auto shadow-sm rounded-lg transition-all duration-200 hover:shadow-md"> 
                {selectedDate ? (
                  timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedTime === slot ? "default" : "outline"}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-3 text-sm transition-all duration-200 rounded-md hover:scale-105 active:scale-95 ${
                            selectedTime === slot 
                              ? "bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white shadow-sm" 
                              : "bg-[#5F9EE9] bg-opacity-5 border border-[#5F9EE9] border-opacity-30 text-[#2A3142] hover:bg-opacity-10"
                          }`} 
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[#808487]">
                      <Clock className="h-10 w-10 text-[#5F9EE9] text-opacity-50 mb-3" />
                      <p className="font-medium text-[#2A3142]">Aucun créneau disponible</p>
                      <p className="text-sm mt-2">Veuillez sélectionner une autre date</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#808487]">
                    <Calendar className="h-10 w-10 text-[#5F9EE9] text-opacity-50 mb-3" />
                    <p className="font-medium text-[#2A3142]">Sélectionnez une date</p>
                    <p className="text-sm mt-2">pour voir les créneaux disponibles</p>
                  </div>
                )}
              </div>
              
              {selectedDate && selectedTime && (
                <div className="mt-4 p-3 bg-[#5F9EE9] bg-opacity-10 border border-[#5F9EE9] border-opacity-30 text-[#2A3142] rounded-lg shadow-sm transition-all duration-200"> 
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#5F9EE9]" />
                    <p className="text-sm font-medium">
                      Vous avez sélectionné le {format(selectedDate, "dd/MM/yyyy")} à {selectedTime}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {currentStep === 2 && (
          <div className="mt-2">
            <h3 className="text-sm font-medium text-[#2A3142] mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-[#5F9EE9]" />
              Vos informations
            </h3>
            
            <div className="mb-6 p-3 bg-[#5F9EE9] bg-opacity-10 border border-[#5F9EE9] border-opacity-30 rounded-lg shadow-sm transition-all duration-200"> 
              <div className="flex items-center gap-2 text-[#2A3142]">
                <Calendar className="h-4 w-4 text-[#5F9EE9]" />
                <p className="text-sm font-medium">
                  {selectedDate && format(selectedDate, "dd/MM/yyyy")} à {selectedTime}
                </p>
                <span className="text-xs px-2 py-1 bg-[#F7B84B] text-white rounded-full ml-auto">
                  {event?.duration} min
                </span>
              </div>
            </div>
            
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="name" className="block text-sm text-[#2A3142] font-medium mb-1 flex items-center gap-1">
                    <User className="h-3 w-3 text-[#808487]" />
                    Nom complet
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <User className="h-4 w-4 text-[#5F9EE9]" />
                    </div>
                    <Input 
                      id="name"
                      {...register("name")} 
                      placeholder="Votre nom" 
                      className="pl-9 border border-[#5F9EE9] border-opacity-30 bg-[#5F9EE9] bg-opacity-5 focus:ring-2 focus:ring-[#5F9EE9] focus:border-transparent transition-all duration-200 rounded-md shadow-sm"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[#F06449] text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-[#F06449] rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>
                
                <div className="flex-1">
                  <label htmlFor="email" className="block text-sm text-[#2A3142] font-medium mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3 text-[#808487]" />
                    Adresse email
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <Mail className="h-4 w-4 text-[#5F9EE9]" />
                    </div>
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="Votre email"
                      className="pl-9 border border-[#5F9EE9] border-opacity-30 bg-[#5F9EE9] bg-opacity-5 focus:ring-2 focus:ring-[#5F9EE9] focus:border-transparent transition-all duration-200 rounded-md shadow-sm"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[#F06449] text-xs mt-1 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-[#F06449] rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-sm text-[#2A3142] font-medium mb-1 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-[#808487]" />
                  Informations complémentaires (optionnel)
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-3">
                    <MessageSquare className="h-4 w-4 text-[#5F9EE9]" />
                  </div>
                  <Textarea
                    id="additionalInfo"
                    {...register("additionalInfo")}
                    placeholder="Partagez toute information qui pourrait être utile pour la réunion"
                    className="pl-9 border border-[#5F9EE9] border-opacity-30 bg-[#5F9EE9] bg-opacity-5 focus:ring-2 focus:ring-[#5F9EE9] focus:border-transparent transition-all duration-200 rounded-md shadow-sm min-h-24"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        
        <div className="pt-6 mt-6 border-t border-[#5F9EE9] border-opacity-20">
          <div className="flex justify-between">
            {currentStep === 2 && (
              <Button 
                onClick={prevStep} 
                className="bg-[#2A3142] bg-opacity-5 text-[#2A3142] hover:bg-[#2A3142] hover:bg-opacity-10 border border-[#2A3142] border-opacity-10 transition-all duration-200 rounded-md flex items-center gap-2 px-4" 
              >
                <ChevronLeft className="h-4 w-4" />
                Retour
              </Button>
            )}
            
            <Button 
              onClick={nextStep} 
              disabled={loading || (currentStep === 1 && (!selectedDate || !selectedTime)) || (currentStep === 2 && (!name || !email))} 
              className={`${currentStep === 1 ? "ml-auto" : ""} bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white font-medium py-2 px-6 rounded-md shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 ${
                (currentStep === 1 && (!selectedDate || !selectedTime)) || (currentStep === 2 && (!name || !email))
                  ? "opacity-70 cursor-not-allowed hover:scale-100"
                  : ""
              }`} 
            >
              {currentStep === 1 
                ? (
                  <>
                    Continuer
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) 
                : loading 
                  ? "Réservation en cours..." 
                  : (
                    <>
                      Confirmer la réservation
                      <Check className="h-4 w-4" />
                    </>
                  )
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}