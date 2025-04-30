import { useState, useEffect } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  location: string;
  quantity: number;
  condition?: string;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
} 