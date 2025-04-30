"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Sprout, Wheat, LeafyGreen, Apple, BadgeCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGroups } from "@/hooks/useGroups";

export default function CropGroupsCard() {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cropType, setCropType] = useState("");
  const { toast } = useToast();
  const { groups, loading, error } = useGroups();

  const handleCreateGroup = async () => {
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          cropType,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const data = await response.json();
      toast({
        title: "Group created successfully",
        description: `Your ${name} group has been created.`,
      });

      // Reset form
      setIsCreating(false);
      setName("");
      setDescription("");
      setCropType("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cropIcons = {
    wheat: <Wheat className="h-5 w-5 text-amber-500" />,
    rice: <Sprout className="h-5 w-5 text-green-600" />,
    vegetables: <LeafyGreen className="h-5 w-5 text-emerald-500" />,
    fruits: <Apple className="h-5 w-5 text-red-500" />,
    organic: <BadgeCheck className="h-5 w-5 text-purple-500" />
  };

  return (
    <div className="space-y-3">
      <CardHeader className="p-0">
        <div className="flex justify-between items-center px-2">
          <CardTitle>Crop Groups</CardTitle>
          {!isCreating && (
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="gap-1"
            >
              <Sprout className="h-4 w-4" />
              New Group
            </Button>
          )}
        </div>
      </CardHeader>

      {isCreating ? (
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                placeholder="e.g., Organic Wheat Farmers"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="What's this group about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Crop Type</label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a crop type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wheat" className="flex items-center gap-2">
                    <Wheat className="h-4 w-4 text-amber-500" /> Wheat
                  </SelectItem>
                  <SelectItem value="rice" className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-green-600" /> Rice
                  </SelectItem>
                  <SelectItem value="vegetables" className="flex items-center gap-2">
                    <LeafyGreen className="h-4 w-4 text-emerald-500" /> Vegetables
                  </SelectItem>
                  <SelectItem value="fruits" className="flex items-center gap-2">
                    <Apple className="h-4 w-4 text-red-500" /> Fruits
                  </SelectItem>
                  <SelectItem value="organic" className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-purple-500" /> Organic
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreateGroup} className="flex-1">
                Create Group
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
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
            ) : groups.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No groups found. Create one to get started!
              </div>
            ) : (
              <>
                {groups.map((group) => (
                  <div
                    key={group._id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                        {cropIcons[group.cropType as keyof typeof cropIcons]}
                      </div>
                      <div>
                        <span className="font-medium">{group.name}</span>
                        <p className="text-sm text-gray-500">{group.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      Join
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link href="/groups">Show all</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}