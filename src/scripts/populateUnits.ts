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

async function populateUnits() {
  try {
    await connectToDatabase();

    for (const unit of commonUnits) {
      const existingUnit = await Unit.findOne({ symbol: unit.symbol });
      if (!existingUnit) {
        await Unit.create(unit);
      }
    }
    process.exit(0);
  } catch {

    process.exit(1);
  }
}

populateUnits(); 