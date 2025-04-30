"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Calendar, Wheat, Sprout, LeafyGreen, Apple, BadgeCheck } from "lucide-react";

interface Group {
  _id: string;
  name: string;
  description: string;
  cropType: string;
  createdBy: {
    name: string;
  };
  members: Array<{
    user: {
      name: string;
    };
  }>;
}

interface GroupsListProps {
  groups: Group[];
  onJoinGroup: (groupId: string) => void;
  loading: boolean;
  error: string | null;
}

const cropIcons = {
  wheat: <Wheat className="h-6 w-6 text-amber-500" />,
  rice: <Sprout className="h-6 w-6 text-green-600" />,
  vegetables: <LeafyGreen className="h-6 w-6 text-emerald-500" />,
  fruits: <Apple className="h-6 w-6 text-red-500" />,
  organic: <BadgeCheck className="h-6 w-6 text-purple-500" />
};

export function GroupsList({ groups, onJoinGroup, loading, error }: GroupsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            {error}
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No groups found. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
              <div
                key={group._id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    {cropIcons[group.cropType as keyof typeof cropIcons]}
                  </div>
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.cropType}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-3">{group.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{group.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created by {group.createdBy.name}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={() => onJoinGroup(group._id)}
                >
                  Join Group
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 