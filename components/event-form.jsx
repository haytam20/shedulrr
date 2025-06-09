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
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2A3142]">
          {initialData.id ? "Editar evento" : "Crear evento"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-[#808487] hover:text-[#2A3142] transition-colors duration-200"
            type="button"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Formulario */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Campo de Título */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-[#2A3142]">
            Título del evento <span className="text-[#F06449]">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            className={`${errors.title ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
            placeholder="Ingresa el título del evento"
          />
          {errors.title && (
            <p className="text-[#F06449] text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Campo de Descripción */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-[#2A3142]">
            Descripción <span className="text-[#F06449]">*</span>
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={5}
            className={`${errors.description ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
            placeholder="Ingresa la descripción del evento"
          />
          {errors.description && (
            <p className="text-[#F06449] text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Campo de Duración */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium text-[#2A3142]">
            Duración (minutos) <span className="text-[#F06449]">*</span>
          </Label>
          <Input
            id="duration"
            {...register("duration", { valueAsNumber: true })}
            type="number"
            className={`${errors.duration ? "border-[#F06449]" : "border-gray-300"} rounded-lg`}
            placeholder="Ingresa la duración en minutos"
          />
          {errors.duration && (
            <p className="text-[#F06449] text-xs mt-1">{errors.duration.message}</p>
          )}
        </div>

        {/* Campo de Privacidad */}
        <div className="space-y-2">
          <Label htmlFor="isPrivate" className="text-sm font-medium text-[#2A3142]">
            Privacidad <span className="text-[#F06449]">*</span>
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
                  <SelectValue placeholder="Seleccionar privacidad" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-[#5F9EE9]">
                  <SelectItem value="true" className="hover:bg-[#5F9EE9]/10">Privado</SelectItem>
                  <SelectItem value="false" className="hover:bg-[#5F9EE9]/10">Público</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.isPrivate && (
            <p className="text-[#F06449] text-xs mt-1">{errors.isPrivate.message}</p>
          )}
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-[#F06449]/10 border border-[#F06449] text-[#F06449] px-4 py-3 rounded-lg text-sm">
            {error.message}
          </div>
        )}

        {/* Acciones del Formulario */}
        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-lg bg-[#F7B84B] hover:bg-[#F06449] text-white transition-colors duration-200"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={loading}
           className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm"
              >
            {loading ? "Procesando..." : initialData.id ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;