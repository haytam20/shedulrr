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

export default function MeetingList({ meetings, type }) {
  if (meetings.length === 0) {
    return <p className="text-gray-500 text-center py-8">No {type} meetings found.</p>;
  }

  const getStatusBadge = (meeting) => {
    // Determine status based on meeting type or date
    const isUpcoming = type === "upcoming";
    const status = isUpcoming ? "En Cours" : "Terminer";
    
    return (
      <span
        className={`px-2 py-1 text-xs rounded-md ${
          status === "En Cours"
            ? "bg-orange-100 text-orange-500"
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
          className="flex flex-col justify-between border border-gray-200 rounded-none shadow-sm hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                {meeting.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-xl font-medium text-gray-800">{meeting.event.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  with {meeting.name}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">
                {format(new Date(meeting.startTime), "dd/MM/yyyy")}
              </span>
              {getStatusBadge(meeting)}
            </div>
            
            {meeting.additionalInfo && (
              <p className="text-sm text-gray-700 mb-4 italic">
                &quot;{meeting.additionalInfo}&quot;
              </p>
            )}
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{format(new Date(meeting.startTime), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-gray-700">
                  {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                  {format(new Date(meeting.endTime), "h:mm a")}
                </span>
              </div>
              {meeting.meetLink && (
                <div className="flex items-center">
                  <Video className="mr-2 h-4 w-4 text-gray-400" />
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:text-orange-600 hover:underline"
                  >
                    Join Meeting
                  </a>
                </div>
              )}
            </div>
          </CardContent>
          {type === "upcoming" && (
            <CardFooter className="flex justify-center pt-2 border-t border-gray-100">
              <CancelMeetingButton 
                meetingId={meeting.id} 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm py-2 rounded-none"
              />
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}