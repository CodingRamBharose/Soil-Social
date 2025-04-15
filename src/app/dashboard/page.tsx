"use client";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserData } from "@/hooks/useUserData";

export default function DashboardPage() {
  const { user, isLoading, error } = useUserData();

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
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
              Crops: {user  ?.cropsGrown?.join(', ') || 'Not specified'}
            </p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/profile">View Profile</Link>
            </Button>
          </div>
        </Card>

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
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Ram</p>
                  <p className="text-sm text-gray-500">Wheat Farmer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Piyush</p>
                  <p className="text-sm text-gray-500">Organic Vegetables</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Raghav</p>
                  <p className="text-sm text-gray-500">Organic Fruits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Nishant</p>
                  <p className="text-sm text-gray-500">Oilseed Crops</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-2" asChild>
                <Link href="/network">Show all</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Groups */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Groups</CardTitle>
            <CardDescription>Join farming communities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg w-full flex items-center justify-around">
                <span className="font-medium">🌾 Wheat Farmers</span>
                <Button className='bg-transparent text-green-300 text-md hover:bg-transparent hover:border-none cursor-pointer hover:scale-125 ' >Join</Button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2 rounded-lg w-full flex items-center justify-around">
                <span className="font-medium">🥬 Organic Farmers</span>
                <Button className='bg-transparent text-green-300 text-md hover:bg-transparent hover:border-none cursor-pointer hover:scale-125 '>Join</Button>
              </div>
            </div>
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
            <div className="border-b pb-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>R</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Ram</p>
                  <p className="text-sm text-gray-500">2h ago · Wheat Farmer</p>
                  <p className="mt-2">
                    Just implemented drip irrigation in my wheat fields. Seeing 30% water savings already! Anyone else using this technique?
                  </p>
                  <div className="flex gap-4 mt-3">
                    <Button variant="ghost" size="sm">👍 12</Button>
                    <Button variant="ghost" size="sm">💬 5</Button>
                    <Button variant="ghost" size="sm">🔄 Share</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample Post 2 */}
            <div className="border-b pb-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Piyush</p>
                  <p className="text-sm text-gray-500">5h ago · Organic Farmer</p>
                  <p className="mt-2">
                    Sharing my organic pest control recipe: Neem oil (5ml) + Garlic (10g) + Chili powder (5g) per liter of water. Works great for most common pests!
                  </p>
                  <div className="flex gap-4 mt-3">
                    <Button variant="ghost" size="sm">👍 24</Button>
                    <Button variant="ghost" size="sm">💬 8</Button>
                    <Button variant="ghost" size="sm">🔄 Share</Button>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">Show more posts</Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-4">
        {/* Weather */}
        <Card>
          <CardHeader>
            <CardTitle>Weather Updates</CardTitle>
            <CardDescription>Patiala</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">28°C</p>
                <p className="text-gray-600">Partly Cloudy</p>
              </div>
              <div className="text-4xl">🌤️</div>
            </div>
            <div className="grid grid-cols-5 gap-2 mt-4 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                <div key={day}>
                  <p className="text-sm">{day}</p>
                  <p className="text-xl">☀️</p>
                  <p className="text-sm">30°</p>
                </div>
              ))}
            </div>
            <Button variant="link" className="mt-2 p-0 text-green-600" asChild>
              <Link href="/weather">View detailed forecast</Link>
            </Button>
          </CardContent>
        </Card>

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