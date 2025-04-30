import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Event } from "@/models/event";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { Types } from "mongoose";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user is already attending
    if (event.attendees.includes(session.user.id)) {
      return NextResponse.json(
        { error: "You are already attending this event" },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json(
        { error: "Event is full" },
        { status: 400 }
      );
    }

    // Add user to attendees
    event.attendees.push(session.user.id);
    await event.save();

    return NextResponse.json({ message: "RSVP successful" });
  } catch (error) {
    console.error("Error RSVPing to event:", error);
    return NextResponse.json(
      { error: "Failed to RSVP to event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const event = await Event.findById(params.id);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      (attendeeId: Types.ObjectId) => attendeeId.toString() !== session.user.id
    );
    await event.save();

    return NextResponse.json({ message: "RSVP cancelled" });
  } catch (error) {
    console.error("Error cancelling RSVP:", error);
    return NextResponse.json(
      { error: "Failed to cancel RSVP" },
      { status: 500 }
    );
  }
} 