"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Sprout, Wheat, LeafyGreen, Apple, BadgeCheck, Loader2, Users, Calendar } from "lucide-react";
import { useGroups } from "@/hooks/useGroups";
import { GroupsList } from "./GroupsList";
import { JoinedGroups } from "./JoinedGroups";

export default function GroupsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cropType, setCropType] = useState("");
  const { toast } = useToast();
  const { groups, loading, error, joinedGroups } = useGroups();

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

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to join group');
      }

      toast({
        title: "Success",
        description: "You have joined the group successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cropIcons = {
    wheat: <Wheat className="h-6 w-6 text-amber-500" />,
    rice: <Sprout className="h-6 w-6 text-green-600" />,
    vegetables: <LeafyGreen className="h-6 w-6 text-emerald-500" />,
    fruits: <Apple className="h-6 w-6 text-red-500" />,
    organic: <BadgeCheck className="h-6 w-6 text-purple-500" />
  };

  return (
    <div className="container mx-auto py-8 px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Crop Groups</h1>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2"
        >
          <Sprout className="h-4 w-4" />
          Create New Group
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <SelectItem value="wheat">Wheat</SelectItem>
                  <SelectItem value="rice">Rice</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="organic">Organic</SelectItem>
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <GroupsList 
            groups={groups} 
            onJoinGroup={handleJoinGroup}
            loading={loading}
            error={error}
          />
        </div>
        <div className="lg:col-span-1">
          <JoinedGroups joinedGroups={joinedGroups} />
        </div>
      </div>
    </div>
  );
} 