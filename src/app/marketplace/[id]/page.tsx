"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Utensils, Wrench, Loader2, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/marketplace";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button asChild>
          <Link href="/marketplace">
            Back to Marketplace
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gray-100">
                {product.category === "food" ? (
                  <Utensils className="h-5 w-5 text-green-500" />
                ) : (
                  <Wrench className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <CardTitle>{product.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold">
                  ₹{product.price.toLocaleString('en-IN')}
                  {product.category === "food" && product.unit && ` per ${product.unit}`}
                </h3>
                <p className="text-sm text-gray-500">Quantity: {product.quantity} {product.unit || ''}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{product.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <p className="text-gray-600">{product.location}</p>
              </div>

              {product.category === "equipment" && product.condition && (
                <div>
                  <h4 className="font-medium mb-2">Condition</h4>
                  <p className="text-gray-600 capitalize">{product.condition}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Listed On</h4>
                <p className="text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Name</h4>
                <p className="text-gray-600">{product.seller.name}</p>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => window.location.href = `/messages/${product.seller._id}`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </div>

              <div className="pt-4">
                <Button className="w-full" asChild>
                  <Link href="/marketplace">
                    Back to Marketplace
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 