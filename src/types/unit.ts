export interface Unit {
  _id: string;
  name: string;
  symbol: string;
  category: "food" | "equipment";
  createdAt?: string;
  updatedAt?: string;
} 