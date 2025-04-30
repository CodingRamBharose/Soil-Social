"use client";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from "@/hooks/useUserData";
import { usePosts } from "@/hooks/usePost";
import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/dashboardComponents/PostCard";
import { WeatherCard } from "@/components/dashboardComponents/WeatherCard";
import { ConnectionCard } from "@/components/dashboardComponents/ConnectionCard";
import { ConnectionRequestsCard } from "@/components/dashboardComponents/ConnectionRequestsCard";
import CropGroupsCard from "@/components/dashboardComponents/CropGroupsCard";

export default function DashboardContent() {
  const { user, isLoading, error } = useUserData();
  const { posts, loading: postsLoading, error: postsError } = usePosts();

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || postsError) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 p-4 max-w-7xl mx-auto">
      {/* Left Sidebar */}
      <div className="space-y-4">
        {/* Profile Card */}
        <Card className="p-4">
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              {user.image ? (
                <CldImage
                  src={user.image}
                  width={96}
                  height={96}
                  alt="Profile"
                  className="rounded-full"
                />
              ) : (
                <AvatarFallback>
                  {user.name?.charAt(0) || 'F'}
                </AvatarFallback>
              )}
            </Avatar>
            <h2 className="text-xl font-bold">{user.name || 'Farmer'}</h2>
            <p className="text-gray-600">{user.email}</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </Card>

        {/* Crop Groups Card */}
        <CropGroupsCard />

        {/* Connections */}
        <ConnectionCard user={user} />
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        {/* Create Post */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 justify-start text-gray-500"
                asChild
              >
                <Link href="/post/create">Share farming updates, tips or questions</Link>
              </Button>
            </div>
            <div className="flex justify-between mt-3">
              <Button variant="ghost">
                <span className="text-green-600">🌱 Crop Health</span>
              </Button>
              <Button variant="ghost">
                <span className="text-blue-600">💧 Irrigation</span>
              </Button>
              <Button variant="ghost">
                <span className="text-orange-600">🌾 Harvest</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts */}
        {postsLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          posts?.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4">
        <WeatherCard location={user.location} />
        <ConnectionRequestsCard />
      </div>
    </div>
  );
} 