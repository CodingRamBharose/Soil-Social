"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CldImage } from "next-cloudinary";
import { Edit2, Camera, Loader2 } from "lucide-react";
import { ProfileForm } from "@/components/ProfileForm";
import { useUserData } from "@/hooks/useUserData";
import { useUserPosts } from "@/hooks/useUserPosts";
import { UserPostCard } from "@/components/profileComponents/UserPostCard";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, isLoading, error, refreshUserData } = useUserData();
  const { posts, loading: postsLoading, error: postsError, deletePost } = useUserPosts(user?._id);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload image
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');
      const { secure_url } = await uploadResponse.json();

      // 2. Update profile with new image
      const updateResponse = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: secure_url }),
      });

      if (!updateResponse.ok) throw new Error('Profile update failed');

      // 3. Refresh data
      await refreshUserData();
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      e.target.value = '';
    }
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="relative p-0">
          <div className="h-48 bg-green-100 rounded-t-lg"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 px-6 pb-6 mt-[-3rem]">
            <div className="relative group">
              {user.profilePicture ? (
                <CldImage
                  src={user.profilePicture}
                  width={128}
                  height={128}
                  alt="Profile"
                  className="rounded-full border-4 h-32 border-white bg-white"
                />
              ) : (
                <Avatar className="w-32 h-32 border-4 border-white">
                  <AvatarFallback className="text-4xl bg-green-100">
                    {user.name?.charAt(0) || "F"}
                  </AvatarFallback>
                </Avatar>
              )}
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full border cursor-pointer hover:bg-gray-100">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isLoading}
                />
              </label>
            </div>

            <div className="flex-1 flex justify-between items-start sm:items-end">
              <div className="space-y-2">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <p className="text-gray-600 flex items-center gap-1">
                  🌱 {user.location || "Farm Location"}
                </p>
              </div>

              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsEditing(!isEditing)}
                disabled={isLoading}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {isEditing ? (
            <ProfileForm
              user={user}
              onSuccess={async () => {
                await refreshUserData();
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg">About</h3>
                <p className="text-gray-300 mt-2">
                  {user.bio || "No bio added yet."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg">Crops Grown</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.cropsGrown?.length ? (
                      user.cropsGrown.map((crop: string) => (
                        <span key={crop} className="pl-4 w-full text-white">
                          {crop}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Farming Techniques</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.farmingTechniques?.length ? (
                      user.farmingTechniques.map((tech: string) => (
                        <span key={tech} className="pl-4 w-full text-white">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Posts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {postsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : postsError ? (
            <div className="text-center py-8 text-red-500">
              Error loading posts: {postsError}
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <UserPostCard key={post._id} post={post} onDelete={deletePost} />
            ))
          ) : (
            <div className="text-center py-8">
              <p>You haven&apos;t created any posts yet.</p>
              <Button asChild className="mt-4">
                <a href="/post/create">Create Post</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}