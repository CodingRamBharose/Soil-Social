"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Utensils, Wrench, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/marketplace";

export default function MarketplacePage() {
  const { products, loading, error } = useProducts();


  const foodProducts = products.filter((product) => product.category === "food");
  const equipmentProducts = products.filter((product) => product.category === "equipment");

  return (
    <div className="container mx-auto py-8 px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <Button asChild>
          <Link href="/marketplace/new">
            <Package className="mr-2 h-4 w-4" />
            List New Product
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="food" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="food" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Food & Produce
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Equipment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="food">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : foodProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No food products available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {foodProducts.map((product) => (
                <ProductCard key={product._id} product={product as Product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="equipment">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          ) : equipmentProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No equipment available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipmentProducts.map((product) => (
                <ProductCard key={product._id} product={product as Product} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-gray-100">
            {product.category === "food" ? (
              <Utensils className="h-5 w-5 text-green-500" />
            ) : (
              <Wrench className="h-5 w-5 text-blue-500" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">
              ₹{product.price.toLocaleString('en-IN')}
              {product.category === "food" && product.unit && ` per ${product.unit}`}
            </p>
            {product.category === "food" && product.unit && (
              <p className="text-xs text-gray-400">
                Available: {product.quantity} {String(product.unit)}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Listed by {product.seller?.name || 'Anonymous'}
          </span>
          <Button size="sm" asChild>
            <Link href={`/marketplace/${product._id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 