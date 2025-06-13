import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventDetails({ event }) {
  const { user } = event;

  return (
    <div className="p-8 lg:w-1/3 bg-gradient-to-br from-white to-gray-50 border-l border-gray-200 shadow-sm">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {event.title}
        </h1>
        <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
      </div>

      {/* Host Info */}
      <div className="flex items-center mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <Avatar className="w-14 h-14 mr-4 ring-2 ring-blue-100">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          <p className="text-gray-600 text-sm">{user.email}</p>
          <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Host
          </span>
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-4">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Duration</p>
            <p className="text-gray-900 font-semibold">
              {event.duration} minutes
            </p>
          </div>
        </div>

        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mr-4">
            <Video className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Meeting Type</p>
            <p className="text-gray-900 font-semibold">Google Meet</p>
          </div>
        </div>

        {event.location && (
          <div className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mr-4">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Location</p>
              <p className="text-gray-900 font-semibold">{event.location}</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-600" />
            About this meeting
          </h3>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You&apos;ll receive a calendar invitation with
          the Google Meet link after booking.
        </p>
      </div>
    </div>
  );
}
