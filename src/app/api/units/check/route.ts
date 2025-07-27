import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Unit from "@/models/Unit";

const commonUnits = [
  { name: "Kilogram", symbol: "kg", category: "food" },
  { name: "Quintal", symbol: "quintal", category: "food" },
  { name: "Ton", symbol: "ton", category: "food" },
  { name: "Piece", symbol: "piece", category: "food" },
  { name: "Dozen", symbol: "dozen", category: "food" },
  { name: "Bunch", symbol: "bunch", category: "food" },
  { name: "Liter", symbol: "L", category: "food" },
  { name: "Kiloliter", symbol: "kL", category: "food" },
  { name: "Bag", symbol: "bag", category: "food" },
  { name: "Sack", symbol: "sack", category: "food" },
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Check if any units exist
    const existingUnits = await Unit.find();
    if (existingUnits.length === 0) {
      // Populate units if none exist
      for (const unit of commonUnits) {
        await Unit.create(unit);
      }
    }

    const units = await Unit.find().sort({ name: 1 });
    return NextResponse.json({ success: true, data: units });
  } catch {

    return NextResponse.json(
      { success: false, error: "Failed to check/populate units" },
      { status: 500 }
    );
  }
} 