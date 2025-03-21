"use client"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { eventSchema } from "@/app/lib/validators"
import { createEvent } from "@/actions/events"
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/use-fetch"
import { X } from "lucide-react"
import { Label } from "@/components/ui/label"

const EventForm = ({ onSubmitForm, initialData = {}, onCancel }) => {
  const router = useRouter()
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
  })

  const { loading, error, fn: fnCreateEvent } = useFetch(createEvent)

  const onSubmit = async (data) => {
    await fnCreateEvent(data)
    if (!loading && !error) onSubmitForm()
    router.refresh() // Refresh the page to show updated data
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">{initialData.id ? "Modifier l'événement" : "Créer un événement"}</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700" type="button">
            <X size={24} />
          </button>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Titre de l'événement <span className="text-red-500">*</span>
          </Label>
          <Input id="title" {...register("title")} className={errors.title ? "border-red-500" : ""} />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            {...register("description")}
            id="description"
            rows={5}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">
            Durée (minutes) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="duration"
            {...register("duration", {
              valueAsNumber: true,
            })}
            type="number"
            className={errors.duration ? "border-red-500" : ""}
          />
          {errors.duration && <p className="text-red-500 text-xs">{errors.duration.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isPrivate" className="text-sm font-medium">
            Confidentialité <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="isPrivate"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => field.onChange(value === "true")}
                value={field.value ? "true" : "false"}
              >
                <SelectTrigger id="isPrivate">
                  <SelectValue placeholder="Sélectionner la confidentialité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Privé</SelectItem>
                  <SelectItem value="false">Public</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error.message}
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="rounded-none">
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white rounded-none">
            {loading ? "Traitement en cours..." : initialData.id ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EventForm

