import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Video } from "lucide-react";
import CancelMeetingButton from "./cancel-meeting";

export default function ListeReunions({ meetings, type }) {
  if (meetings.length === 0) {
    return <p className="text-[#808487] dark:text-[#FFFFFF] text-center py-8">Aucune réunion {type} trouvée.</p>;
  }

  const getStatusBadge = (meeting) => {
    // Determine status based on meeting type or date
    const isUpcoming = type === "upcoming";
    const status = isUpcoming ? "En Cours" : "Terminé";
    
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          status === "En Cours"
            ? "bg-[#F7B84B] bg-opacity-20 text-[#F7B84B]"
            : "bg-green-100 text-green-500"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <Card 
          key={meeting.id} 
          className="flex flex-col justify-between border border-gray-200 dark:border-[#5F9EE9] dark:border-opacity-30 shadow-lg hover:shadow-xl transition-all duration-200 bg-[#FFFFFF] dark:bg-[#2A3142]"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5F9EE9] bg-opacity-20 dark:bg-[#5F9EE9] dark:bg-opacity-30 rounded-full flex items-center justify-center text-[#5F9EE9] font-medium">
                {meeting.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl font-medium text-[#2A3142] dark:text-[#FFFFFF]">{meeting.event.title}</CardTitle>
                <CardDescription className="text-sm text-[#808487]">
                  avec {meeting.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-[#808487]">
                {format(new Date(meeting.startTime), "dd/MM/yyyy")}
              </span>
              {getStatusBadge(meeting)}
            </div>
            
            {meeting.additionalInfo && (
              <p className="text-sm text-[#2A3142] dark:text-[#FFFFFF] mb-4 italic">
                &quot;{meeting.additionalInfo}&quot;
              </p>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-[#808487]" />
                <span className="text-[#2A3142] dark:text-[#FFFFFF]">{format(new Date(meeting.startTime), "d MMMM yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-[#808487]" />
                <span className="text-[#2A3142] dark:text-[#FFFFFF]">
                  {format(new Date(meeting.startTime), "HH:mm")} -{" "}
                  {format(new Date(meeting.endTime), "HH:mm")}
                </span>
              </div>
              {meeting.meetLink && (
                <div className="flex items-center">
                  <Video className="mr-2 h-4 w-4 text-[#808487]" />
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5F9EE9] hover:text-[#4A8BD6] hover:underline transition-colors duration-200"
                  >
                    Rejoindre la réunion
                  </a>
                </div>
              )}
            </div>
          </CardContent>
          {type === "upcoming" && (
            <CardFooter className="flex justify-center pt-2 border-t border-gray-100 dark:border-[#5F9EE9] dark:border-opacity-20">
              <CancelMeetingButton 
                meetingId={meeting.id} 
                className="w-full bg-[#F7B84B] hover:bg-[#E9547B] rounded-md text-white text-sm py-2 transition-colors duration-200 focus:ring-2 focus:ring-[#5F9EE9] focus:ring-opacity-50 active:scale-95"
              />
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}