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
import { Calendar, Clock, User, Mail, MessageSquare, Video, Check } from "lucide-react";
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
      <div className="text-center p-8 border border-[#5F9EE9] bg-white shadow-lg rounded-lg"> 
        <div className="w-16 h-16 bg-[#5F9EE9] bg-opacity-20 flex items-center justify-center mx-auto mb-4 rounded-full"> 
          <Video className="h-8 w-8 text-[#5F9EE9]" />
        </div>
        <h2 className="text-xl font-semibold text-[#2A3142] mb-3">Réservation confirmée!</h2>
        <p className="text-[#808487] mb-4">
          Votre réservation avec {event?.title} a été enregistrée pour le{" "}
          {selectedDate && format(selectedDate, "dd/MM/yyyy")} à {selectedTime}.
        </p>
        <div className="bg-[#2A3142] bg-opacity-5 p-4 my-4 border border-[#5F9EE9] border-opacity-20 text-left rounded-lg"> 
          <div className="flex items-center gap-2 mb-2">
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
            <p className="text-[#2A3142] mb-2">Lien pour rejoindre la réunion:</p>
            <a
              href={data.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5F9EE9] hover:text-[#4A8BD6] hover:underline flex items-center justify-center gap-2 transition-colors duration-200" 
            >
              <Video className="h-4 w-4" />
              {data.meetLink}
            </a>
          </div>
        )}
        <Button 
          onClick={() => window.location.reload()}
          className="mt-6 bg-[#F7B84B] text-white hover:bg-[#F7B84B] hover:bg-opacity-80 transition-colors duration-200 rounded-md" 
        >
          Réserver un autre créneau
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 border border-[#5F9EE9] border-opacity-20 bg-white shadow-lg overflow-hidden rounded-lg"> 
      <div className="bg-[#2A3142] bg-opacity-5 p-4 border-b border-[#5F9EE9] border-opacity-20">
        <h2 className="text-lg font-semibold text-[#2A3142] flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#5F9EE9]" />
          Planifier une réunion: {event?.title}
        </h2>
        <p className="text-[#808487] text-sm mt-1">Durée: {event?.duration} minutes</p>
        
        {/* Progress indicator */}
        <div className="flex items-center mt-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              currentStep >= 1 ? "bg-[#5F9EE9] text-white border-[#5F9EE9]" : "bg-[#2A3142] bg-opacity-10 text-[#808487] border-[#808487]"
            } transition-colors duration-200`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium text-[#2A3142]">Date & Heure</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? "bg-[#5F9EE9]" : "bg-[#808487]"} transition-colors duration-200`}></div>
          <div className="flex items-center">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              currentStep >= 2 ? "bg-[#5F9EE9] text-white border-[#5F9EE9]" : "bg-[#2A3142] bg-opacity-10 text-[#808487] border-[#808487]"
            } transition-colors duration-200`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium text-[#2A3142]">Vos informations</span>
          </div>
        </div>
      </div>
      
      <div className="px-6 pt-2 pb-6">
        {currentStep === 1 && (
          <div className="md:flex gap-8">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[#808487]" />
                <h3 className="text-sm font-medium text-[#2A3142]">Sélectionnez une date</h3>
              </div>
              <div className="border border-[#5F9EE9] border-opacity-20 p-2 bg-white shadow-md rounded-lg transition-all duration-200"> 
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
                      opacity: "2",
                      color: "#2A3142",
                      fontWeight: "bold"
                    },
                  }}
                  styles={{
                    caption: { color: "#2A3142" },
                    day: { margin: "0.2em" }
                  }}
                  footer={
                    <div className="text-xs text-center mt-2 text-[#808487]">
                      <span className="inline-block w-3 h-3 bg-[#5F9EE9] bg-opacity-20 mr-1"></span>
                      Dates disponibles
                    </div>
                  }
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-[#808487]" />
                <h3 className="text-sm font-medium text-[#2A3142]">
                  {selectedDate 
                    ? `Créneaux disponibles pour le ${format(selectedDate, "dd/MM/yyyy")}`
                    : "Sélectionnez d'abord une date"}
                </h3>
              </div>
              
              <div className="border border-[#5F9EE9] border-opacity-20 p-4 bg-white h-72 overflow-y-auto shadow-md rounded-lg transition-all duration-200"> 
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
                              ? "bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white border-[#5F9EE9]" 
                              : "bg-[#2A3142] bg-opacity-5 border-[#5F9EE9] border-opacity-20 text-[#2A3142] hover:bg-[#5F9EE9] hover:bg-opacity-10"
                          }`} 
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[#808487]">
                      <Clock className="h-10 w-10 text-[#808487] mb-2" />
                      <p>Aucun créneau disponible</p>
                      <p className="text-sm mt-2">Veuillez sélectionner une autre date</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-[#808487]">
                    <Calendar className="h-10 w-10 text-[#808487] mb-2" />
                    <p>Sélectionnez une date pour voir les créneaux disponibles</p>
                  </div>
                )}
              </div>
              
              {selectedDate && selectedTime && (
                <div className="mt-4 p-3 bg-[#5F9EE9] bg-opacity-10 border border-[#5F9EE9] border-opacity-20 text-[#2A3142] rounded-lg transition-all duration-200"> 
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
              <User className="h-4 w-4 text-[#808487]" />
              Vos informations
            </h3>
            
            <div className="mb-6 p-3 bg-[#5F9EE9] bg-opacity-10 border border-[#5F9EE9] border-opacity-20 rounded-lg transition-all duration-200"> 
              <div className="flex items-center gap-2 text-[#2A3142]">
                <Calendar className="h-4 w-4 text-[#5F9EE9]" />
                <p className="text-sm font-medium">
                  {selectedDate && format(selectedDate, "dd/MM/yyyy")} à {selectedTime}
                </p>
              </div>
            </div>
            
            <form className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="name" className="block text-sm text-[#808487] mb-1">Nom complet</label>
                  <div className="flex items-center border border-[#5F9EE9] border-opacity-20 bg-[#2A3142] bg-opacity-5 focus-within:ring-2 focus-within:ring-[#5F9EE9] transition-all duration-200 rounded-md"> 
                    <User className="ml-3 h-4 w-4 text-[#808487]" />
                    <Input 
                      id="name"
                      {...register("name")} 
                      placeholder="Votre nom" 
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[#F06449] text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="flex-1">
                  <label htmlFor="email" className="block text-sm text-[#808487] mb-1">Adresse email</label>
                  <div className="flex items-center border border-[#5F9EE9] border-opacity-20 bg-[#2A3142] bg-opacity-5 focus-within:ring-2 focus-within:ring-[#5F9EE9] transition-all duration-200 rounded-md"> 
                    <Mail className="ml-3 h-4 w-4 text-[#808487]" />
                    <Input
                      id="email"
                      {...register("email")}
                      type="email"
                      placeholder="Votre email"
                      className="border-0 bg-transparent focus:ring-0"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[#F06449] text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-sm text-[#808487] mb-1">Informations complémentaires (optionnel)</label>
                <div className="flex items-start border border-[#5F9EE9] border-opacity-20 bg-[#2A3142] bg-opacity-5 p-2 focus-within:ring-2 focus-within:ring-[#5F9EE9] transition-all duration-200 rounded-md"> 
                  <MessageSquare className="mt-1 ml-1 h-4 w-4 text-[#808487]" />
                  <Textarea
                    id="additionalInfo"
                    {...register("additionalInfo")}
                    placeholder="Partagez toute information qui pourrait être utile pour la réunion"
                    className="border-0 bg-transparent focus:ring-0 min-h-24"
                  />
                </div>
              </div>
            </form>
          </div>
        )}
        
        <div className="pt-6 mt-4 border-t border-[#5F9EE9] border-opacity-20">
          <div className="flex justify-between">
            {currentStep === 2 && (
              <Button 
                onClick={prevStep} 
                className="bg-[#2A3142] bg-opacity-10 text-[#2A3142] hover:bg-[#2A3142] hover:bg-opacity-20 transition-colors duration-200 rounded-md" 
              >
                Retour
              </Button>
            )}
            
            <Button 
              onClick={nextStep} 
              disabled={loading || (currentStep === 1 && (!selectedDate || !selectedTime)) || (currentStep === 2 && (!name || !email))} 
              className={`${currentStep === 1 ? "ml-auto" : ""} bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white font-medium py-2 rounded-md transition-all duration-200 hover:scale-105 active:scale-95 ${
                (currentStep === 1 && (!selectedDate || !selectedTime)) || (currentStep === 2 && (!name || !email))
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`} 
            >
              {currentStep === 1 
                ? "Continuer" 
                : loading 
                  ? "Réservation en cours..." 
                  : "Confirmer la réservation"
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}