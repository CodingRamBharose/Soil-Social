"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, User, Share2, MessageCircle } from "lucide-react";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAttending, setIsAttending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const response = await fetch(`/api/events/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
        // Check if current user is attending
        if (session?.user?.id) {
          setIsAttending(data.attendees.some((attendee: any) => attendee._id === session.user.id));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [params.id, session?.user?.id]);

  const handleRSVP = async () => {
    if (!session) {
      toast.error("Please sign in to RSVP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: isAttending ? "DELETE" : "POST",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update RSVP");
      }

      // Refresh event data
      const updatedEvent = await fetch(`/api/events/${params.id}`).then(res => res.json());
      setEvent(updatedEvent);
      setIsAttending(!isAttending);
      toast.success(isAttending ? "RSVP cancelled" : "RSVP successful");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update RSVP");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-600">Event not found</h1>
        <p className="text-gray-500 mt-4">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild className="mt-6">
          <Link href="/events">Back to Events</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <div className="relative h-96 w-full">
              {event.imageUrl ? (
                <CldImage
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover rounded-t-lg"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-lg">
                    {event.eventType}
                  </Badge>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-700 text-lg">{event.description}</p>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-700">{event.location.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="text-gray-700">
                      {event.attendees.length}/{event.maxAttendees || "∞"} attendees
                    </span>
                  </div>
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
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organizer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  {event.organizer.profilePicture ? (
                    <CldImage
                      src={event.organizer.profilePicture}
                      alt={event.organizer.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xl">
                        {event.organizer.name?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{event.organizer.name}</h3>
                  {event.organizer.bio && (
                    <p className="text-sm text-gray-500">{event.organizer.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {event.attendees.map((attendee) => (
                    <div key={attendee._id} className="flex items-center space-x-2">
                      <div className="relative w-8 h-8">
                        {attendee.profilePicture ? (
                          <CldImage
                            src={attendee.profilePicture}
                            alt={attendee.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              {attendee.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm">{attendee.name}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleRSVP}
                  disabled={isLoading || event.organizer._id === session?.user?.id}
                >
                  {isLoading ? "Loading..." : isAttending ? "Cancel RSVP" : "RSVP"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/messages/${event.organizer._id}`}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 