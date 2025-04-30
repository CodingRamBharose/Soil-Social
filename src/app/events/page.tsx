"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Loader2 } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface Event {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location: {
    address: string;
    coordinates: number[];
  };
  maxAttendees?: number;
  tags: string[];
  imageUrl?: string;
  organizer: {
    _id: string;
    name: string;
    profilePicture?: string;
    bio?: string;
  };
  attendees: Array<{
    _id: string;
    name: string;
    profilePicture?: string;
  }>;
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingRSVP, setLoadingRSVP] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const handleRSVP = async (eventId: string, isAttending: boolean) => {
    if (!session) {
      toast.error("Please sign in to RSVP");
      return;
    }

    setLoadingRSVP(prev => ({ ...prev, [eventId]: true }));
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: isAttending ? "DELETE" : "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update RSVP");
      }

      // Refresh events data
      const updatedEvents = await fetch("/api/events").then(res => res.json());
      setEvents(updatedEvents);
      toast.success(isAttending ? "RSVP cancelled" : "RSVP successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update RSVP");
    } finally {
      setLoadingRSVP(prev => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className="container mx-auto py-8 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        {session && (
          <Button asChild>
            <Link href="/events/create">Create Event</Link>
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No events available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const isAttending = event.attendees.some(
              (attendee) => attendee._id === session?.user?.id
            );
            const isOrganizer = event.organizer?._id === session?.user?.id;

            return (
              <Card key={event._id} className="flex flex-col">
                <div className="relative h-48">
                  {event.imageUrl ? (
                    <CldImage
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <p className="text-gray-600 line-clamp-2">{event.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{event.eventType}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      {event.location.address}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees.length}/{event.maxAttendees || "∞"} attendees
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <div className="p-4 pt-0 space-y-2">
                  <Button asChild className="w-full">
                    <Link href={`/events/${event._id}`}>View Details</Link>
                  </Button>
                  {!isOrganizer && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleRSVP(event._id, isAttending)}
                      disabled={loadingRSVP[event._id]}
                    >
                      {loadingRSVP[event._id]
                        ? "Loading..."
                        : isAttending
                        ? "Cancel RSVP"
                        : "RSVP"}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
} 