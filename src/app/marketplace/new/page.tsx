"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Utensils, Wrench, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductCreateInput } from "@/types/marketplace";
import { Unit } from "@/types/unit";

const UNITS = [
  { value: "kg", label: "Kilogram (kg)" },
  { value: "quintal", label: "Quintal" },
  { value: "ton", label: "Ton" },
  { value: "piece", label: "Piece" },
  { value: "dozen", label: "Dozen" },
  { value: "bunch", label: "Bunch" },
  { value: "L", label: "Liter (L)" },
  { value: "kL", label: "Kiloliter (kL)" },
  { value: "bag", label: "Bag" },
  { value: "sack", label: "Sack" },
];

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [condition, setCondition] = useState("");
  const [unit, setUnit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData: ProductCreateInput = {
        name,
        description,
        price: parseFloat(price),
        category: category as "food" | "equipment",
        location,
        quantity: parseInt(quantity),
        unit: category === "food" ? unit : undefined,
        condition: category === "equipment" ? condition as "new" | "like-new" | "good" | "fair" | "poor" : undefined,
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      toast({
        title: "Product listed successfully",
        description: "Your product has been added to the marketplace.",
      });

      router.push('/marketplace');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to list product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>List a New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <Input
                required
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                required
                placeholder="Describe your product"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter price in INR"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select required value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food" className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-green-500" /> Food & Produce
                  </SelectItem>
                  <SelectItem value="equipment" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-500" /> Equipment
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                required
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                required
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {category === "equipment" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Condition</label>
                <Select required value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="like-new">Like New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {category === "food" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <Select required value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Listing...
                  </>
                ) : (
                  "List Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 