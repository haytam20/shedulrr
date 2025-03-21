import { Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EventDetails({ event }) {
  const { user } = event;
  return (
    <div className="p-6 bg-white rounded-none shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">{event.title}</h1>
      
      <div className="flex items-center mb-6">
        <Avatar className="w-12 h-12 mr-4 bg-gray-200">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback className="text-gray-500">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
          <p className="text-gray-600 text-sm">{user.email}</p>
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center">
          <Clock className="mr-3 text-gray-500 w-5 h-5" />
          <span className="text-gray-700">{event.duration} minutes</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-3 text-gray-500 w-5 h-5" />
          <span className="text-gray-700">Google Meet</span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed">{event.description}</p>
      
    
    </div>
  );
}