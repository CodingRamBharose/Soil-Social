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

import { ConnectionRequestsCard } from "@/components/dashboardComponents/ConnectionRequestsCard";
import CropGroupsCard from "@/components/dashboardComponents/CropGroupsCard";
export default function DashboardPage() {
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
              {user.profilePicture ? (
                <CldImage
                  src={user.profilePicture}
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
            <p className="text-gray-600">{user.location || 'Farm Location'}</p>
            <p className="text-sm text-gray-500 mt-2">
              Crops: {user?.cropsGrown?.join(', ') || 'Not specified'}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </Card>

        <ConnectionRequestsCard />

        {/* Connections */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Connections</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/network">Grow your network</Link>
              </Button>
            </div>
            <CardDescription>Connect with other farmers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user.connections?.length > 0 ? (
              user.connections.slice(0, 4).map((connection: { _id: string; name: string; profilePicture?: string }) => (
                <div key={connection._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {connection.profilePicture ? (
                        <AvatarImage src={connection.profilePicture} />
                      ) : (
                        <AvatarFallback>
                          {connection.name?.charAt(0) || 'F'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <p className="text-sm text-gray-500">
                        {connection.cropsGrown?.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No connections yet</p>
            )}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/network">Show all</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Groups</CardTitle>
          </CardHeader>
          <CardContent className="p-1">
            <CropGroupsCard />
          </CardContent>
        </Card>
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
              <Button variant="ghost">
                <span className="text-purple-600">📅 Events</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Your Farming Feed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : posts.length > 0 ? (
              posts.map((post,index) => (
                <PostCard key={index} post={post} />
              ))
            ) : (
              <div className="text-center py-8">
                <p>No posts yet. Be the first to share!</p>
                <Button asChild className="mt-4">
                  <Link href="/post/create">Create Post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4">
        {/* Weather */}
        <WeatherCard location={user?.location || null} />

        {/* Marketplace */}
        <Card>
          <CardHeader>
            <CardTitle>Marketplace</CardTitle>
            <CardDescription>Fresh from farms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <span className="text-2xl">🌾</span>
              </div>
              <div>
                <p className="font-medium">Organic Wheat</p>
                <p className="text-sm text-gray-500">₹2,200 per quintal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2 rounded-lg">
                <span className="text-2xl">🍅</span>
              </div>
              <div>
                <p className="font-medium">Fresh Tomatoes</p>
                <p className="text-sm text-gray-500">₹40 per kg</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/marketplace">Browse all produce</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-b pb-3">
              <p className="font-medium">Organic Farming Workshop</p>
              <p className="text-sm text-gray-500">Sat, 15 June · 10:00 AM</p>
              <Button variant="outline" size="sm" className="mt-2">RSVP</Button>
            </div>
            <div className="border-b pb-3">
              <p className="font-medium">Harvest Festival</p>
              <p className="text-sm text-gray-500">Sun, 30 June · All day</p>
              <Button variant="outline" size="sm" className="mt-2">RSVP</Button>
            </div>
            <Button variant="link" className="p-0 text-green-600" asChild>
              <Link href="/events">View all events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>

  );
}