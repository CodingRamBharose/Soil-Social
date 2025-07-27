import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Unit from "@/models/Unit";

export async function GET() {
  try {
    await connectToDatabase();
    const units = await Unit.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: units });
  } catch {

    return NextResponse.json(
      { success: false, error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    const unit = await Unit.create(body);
    return NextResponse.json({ success: true, data: unit });
  } catch (error) {
    console.error("Error creating unit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create unit" },
      { status: 500 }
    );
  }
} 