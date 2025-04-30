export interface Unit {
  _id: string;
  name: string;
  symbol: string;
  category: "food" | "equipment";
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: "food" | "equipment";
  images?: string[];
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  location: string;
  condition?: "new" | "like-new" | "good" | "fair" | "poor";
  quantity: number;
  unit?: Unit;
  status: "available" | "sold" | "reserved";
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  category: "food" | "equipment";
  location: string;
  quantity: number;
  unit?: string; // Unit ID
  condition?: "new" | "like-new" | "good" | "fair" | "poor";
  images?: string[];
}

export interface ProductUpdateInput {
  name?: string;
  description?: string;
  price?: number;
  category?: "food" | "equipment";
  location?: string;
  quantity?: number;
  condition?: "new" | "like-new" | "good" | "fair" | "poor";
  images?: string[];
  status?: "available" | "sold" | "reserved";
}

export interface ProductResponse {
  success: boolean;
  data?: Product;
  error?: string;
}

export interface ProductsListResponse {
  success: boolean;
  data?: Product[];
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
} 