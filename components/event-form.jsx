"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { eventSchema } from "@/app/lib/validators";
import { createEvent } from "@/actions/events";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";

const EventForm = ({ onSubmitForm, initialData = {}, onCancel }) => {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      duration: initialData.duration || 30,
      isPrivate: initialData.isPrivate ?? true,
    },
  });

  const { loading, error, fn: fnCreateEvent } = useFetch(createEvent);

  const onSubmit = async (data) => {
    await fnCreateEvent(data);
    if (!loading && !error) onSubmitForm();
    router.refresh();
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2A3142]">
          {initialData.id ? "Modifier l'événement" : "Créer un événement"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-[#808487] hover:text-[#2A3142] transition-colors duration-200"
            type="button"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Title Field */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-[#2A3142]">
            Titre de l'événement <span className="text-[#F06449]">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            className={`${errors.title ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
            placeholder="Entrez le titre de l'événement"
          />
          {errors.title && (
            <p className="text-[#F06449] text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-[#2A3142]">
            Description <span className="text-[#F06449]">*</span>
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={5}
            className={`${errors.description ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
            placeholder="Entrez la description de l'événement"
          />
          {errors.description && (
            <p className="text-[#F06449] text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Duration Field */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium text-[#2A3142]">
            Durée (minutes) <span className="text-[#F06449]">*</span>
          </Label>
          <Input
            id="duration"
            {...register("duration", { valueAsNumber: true })}
            type="number"
            className={`${errors.duration ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
            placeholder="Entrez la durée en minutes"
          />
          {errors.duration && (
            <p className="text-[#F06449] text-xs mt-1">{errors.duration.message}</p>
          )}
        </div>

        {/* Privacy Field */}
        <div className="space-y-2">
          <Label htmlFor="isPrivate" className="text-sm font-medium text-[#2A3142]">
            Confidentialité <span className="text-[#F06449]">*</span>
          </Label>
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
              >
                <SelectTrigger 
                  id="isPrivate" 
                  className={`${errors.isPrivate ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
                >
                  <SelectValue placeholder="Sélectionner la confidentialité" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-[#5F9EE9]">
                  <SelectItem value="true" className="hover:bg-[#5F9EE9]/10">Privé</SelectItem>
                  <SelectItem value="false" className="hover:bg-[#5F9EE9]/10">Public</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.isPrivate && (
            <p className="text-[#F06449] text-xs mt-1">{errors.isPrivate.message}</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-[#F06449]/10 border border-[#F06449] text-[#F06449] px-4 py-3 rounded-lg text-sm">
            {error.message}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
  <Button
    type="button"
    variant="outline"
    onClick={onCancel}
    className="rounded-lg bg-[#F7B84B] hover:bg-[#F06449] text-white transition-colors duration-200"
  >
    Annuler
  </Button>
)}
<Button
  type="submit"
  disabled={loading}
  className="rounded-lg bg-[#5F9EE9] hover:bg-[#4A8BD6] text-white transition-colors duration-200"
>
  {loading ? "Traitement en cours..." : initialData.id ? "Mettre à jour" : "Créer"}
</Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;