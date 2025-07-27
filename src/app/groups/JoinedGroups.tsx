"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Calendar, Wheat, Sprout, LeafyGreen, Apple, BadgeCheck } from "lucide-react";

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

interface JoinedGroupsProps {
  joinedGroups: Group[];
}

const cropIcons = {
  wheat: <Wheat className="h-5 w-5 text-amber-500" />,
  rice: <Sprout className="h-5 w-5 text-green-600" />,
  vegetables: <LeafyGreen className="h-5 w-5 text-emerald-500" />,
  fruits: <Apple className="h-5 w-5 text-red-500" />,
  organic: <BadgeCheck className="h-5 w-5 text-purple-500" />
};

export function JoinedGroups({ joinedGroups }: JoinedGroupsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Groups</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {joinedGroups.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            You haven&apos;t joined any groups yet.
          </div>
        ) : (
          <div className="space-y-4">
            {joinedGroups.map((group) => (
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
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{group.members.length} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Created by {group.createdBy.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 