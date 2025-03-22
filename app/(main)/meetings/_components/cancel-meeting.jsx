"use client";

import { Button } from "@/components/ui/button";
import { cancelMeeting } from "@/actions/meetings";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { X } from "lucide-react";

export default function BoutonAnnulerReunion({ meetingId, className }) {
  const router = useRouter();

  const { loading, error, fn: fnCancelMeeting } = useFetch(cancelMeeting);

  const handleCancel = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette réunion ?")) {
      await fnCancelMeeting(meetingId);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <Button 
        variant="destructive" 
        onClick={handleCancel} 
        disabled={loading}
        className={`bg-orange-500 hover:bg-orange-600 text-white border-none flex items-center justify-center gap-2 rounded-none ${className || ""}`} // Supprimé rounded-md
      >
        {loading ? (
          "Annulation en cours..."
        ) : (
          <>
            <X className="h-4 w-4" />
            <span>Annuler la réunion</span>
          </>
        )}
      </Button>
      {error && (
        <span className="text-red-500 text-sm text-center">{error.message}</span>
      )}
    </div>
  );
}