"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBasket, Package, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";

export default function MarketplaceCard() {
  const { products, loading, error } = useProducts();

  return (
    <div className="space-y-3">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center px-2">
          <CardTitle>Marketplace</CardTitle>
          <Button
            size="sm"
            asChild
            className="gap-1"
          >
            <Link href="/marketplace/new">
              <Package className="h-4 w-4" />
              List Product
            </Link>
          </Button>
        </div>
      </CardHeader>

      <Card>
        <CardContent className="space-y-3 pt-4">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              {error}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No products listed yet. Be the first to list one!
            </div>
          ) : (
            <>
              {products.slice(0, 3).map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <ShoppingBasket className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <span className="font-medium">{product.name}</span>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    asChild
                  >
                    <Link href={`/marketplace/${product._id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/marketplace">Browse All Products</Link>
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 