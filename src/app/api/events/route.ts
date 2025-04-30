import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Event } from "@/models/event";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find()
      .populate("organizer", "name profilePicture bio")
      .populate("attendees", "name profilePicture")
      .sort({ startDate: 1 });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(options);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      throw new Error("Database connection failed");
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.eventType || !body.startDate || !body.endDate || !body.location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert location string to GeoJSON point
    const location = {
      type: "Point",
      coordinates: [0, 0], // Default coordinates, should be updated with actual geocoding
      address: body.location.address
    };

    const event = new Event({
      title: body.title,
      description: body.description,
      eventType: body.eventType,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      location,
      maxAttendees: body.maxAttendees,
      tags: body.tags || [],
      imageUrl: body.imageUrl,
      organizer: session.user.id,
      attendees: []
    });

    const savedEvent = await event.save();
    
    // Populate the organizer field before sending the response
    await savedEvent.populate("organizer", "name profilePicture");

    return NextResponse.json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
} 