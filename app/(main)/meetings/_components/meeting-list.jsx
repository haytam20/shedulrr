import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Clock, Video, User, MapPin, MessageSquare, ExternalLink } from "lucide-react";
import CancelMeetingButton from "./cancel-meeting";

export default function ListeReunions({ meetings, type }) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
          <Calendar className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Aucune réunion {type === "upcoming" ? "à venir" : "passée"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {type === "upcoming" 
            ? "Vos prochaines réunions apparaîtront ici" 
            : "Vos réunions passées apparaîtront ici"}
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        short: date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit", 
          year: "numeric"
        }),
        long: date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric"
        }),
        time: date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit"
        })
      };
    } catch {
      return {
        short: "Date invalide",
        long: "Date invalide", 
        time: "Heure invalide"
      };
    }
  };

  const formatEndTime = (startTime, endTime) => {
    try {
      const end = new Date(endTime);
      return end.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Heure invalide";
    }
  };

  const getStatusInfo = (meeting) => {
    const isUpcoming = type === "upcoming";
    const now = new Date();
    const meetingStart = new Date(meeting.startTime);
    const meetingEnd = new Date(meeting.endTime);
    
    if (isUpcoming) {
      const timeUntilMeeting = meetingStart - now;
      const hoursUntil = Math.floor(timeUntilMeeting / (1000 * 60 * 60));
      
      if (now >= meetingStart && now <= meetingEnd) {
        return {
          status: "En cours",
          color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
          icon: <Video className="h-3 w-3" />
        };
      } else if (hoursUntil <= 24 && hoursUntil > 0) {
        return {
          status: "Aujourd'hui",
          color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
          icon: <Clock className="h-3 w-3" />
        };
      } else {
        return {
          status: "Programmée",
          color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
          icon: <Calendar className="h-3 w-3" />
        };
      }
    } else {
      return {
        status: "Terminée",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
        icon: <Clock className="h-3 w-3" />
      };
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(n => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => {
        const statusInfo = getStatusInfo(meeting);
        const dateInfo = formatDate(meeting.startTime);
        
        return (
          <Card 
            key={meeting.id} 
            className="group relative overflow-hidden border-0 shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300"
          >
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center font-semibold text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
                      {getInitials(meeting.name)}
                    </div>
                    
                    {/* Meeting Info */}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {meeting.event?.title || "Réunion sans titre"}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <User className="h-3 w-3" />
                        avec {meeting.name}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span 
                    className={`${statusInfo.color} flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full`}
                  >
                    {statusInfo.icon}
                    {statusInfo.status}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 pb-4">
                {/* Additional Info Quote */}
                {meeting.additionalInfo && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800 dark:text-blue-300 italic">
                        "{meeting.additionalInfo}"
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Meeting Details */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {dateInfo.long}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dateInfo.short}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {dateInfo.time} - {formatEndTime(meeting.startTime, meeting.endTime)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Durée: {meeting.event?.duration || 30} minutes
                      </p>
                    </div>
                  </div>
                  
                  {meeting.meetLink && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <a
                          href={meeting.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
                        >
                          Rejoindre la réunion
                          <ExternalLink className="h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Lien de visioconférence
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              
              {type === "upcoming" && (
                <CardFooter className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 pt-4 pb-4">
                  <CancelMeetingButton 
                    meetingId={meeting.id} 
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </CardFooter>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}