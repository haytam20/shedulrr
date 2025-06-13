import { Suspense } from "react";
import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/event-card";
import { Calendar, Plus, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Loading skeleton component
function EventsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 animate-pulse" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-md bg-white dark:bg-gray-800 animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="flex justify-between items-center pt-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty state component
function EmptyEventsState() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Mis eventos
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Crea y gestiona tus eventos de reserva
              </p>
            </div>
            <Link href="/events?create=true">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Plus className="h-4 w-4 mr-2" />
                Crear un evento
              </Button>
            </Link>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-800 mb-6">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No se ha creado ningún evento
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            Comienza creando tu primer evento para permitir que otros reserven tiempo contigo.
          </p>
          <Link href="/events?create=true">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Plus className="h-5 w-5 mr-2" />
              Crear mi primer evento
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Main Events component
async function Events() {
  const { events, username } = await getUserEvents();

  if (events.length === 0) {
    return <EmptyEventsState />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Mis eventos
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {events.length} evento{events.length > 1 ? 's' : ''} creado{events.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* <Link href="/events?create=true">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo evento
                </Button>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total de eventos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {events.length}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Eventos activos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {events.filter(event => event.isPrivate === false).length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Duración promedio
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(events.reduce((acc, event) => acc + event.duration, 0) / events.length)} min
                  </p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Eventos privados
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {events.filter(event => event.isPrivate === true).length}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Search className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events?.map((event) => (
            <EventCard key={event.id} event={event} username={username} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function EventsPage() {
  return (
    <Suspense fallback={<EventsLoading />}>
      <Events />
    </Suspense>
  );
}