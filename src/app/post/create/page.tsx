"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Image as ImageIcon, Video } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<{
    images: string[];
    videos: string[];
  }>({ images: [], videos: [] });
  const [formData, setFormData] = useState({
    content: "",
    cropType: "",
    tags: "",
  });

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
    if (!e.target.files?.length || !user) return;
    setIsLoading(true);

    try {
      const files = Array.from(e.target.files);
      const uploadedMedia = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const { secure_url } = await res.json();
          return secure_url;
        })
      );
      setMedia(prev => ({ ...prev, [type]: [...prev[type], ...uploadedMedia] }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?._id) return;

    setIsLoading(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(Boolean);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          images: media.images,
          videos: media.videos,
          cropType: formData.cropType,
          tags: tagsArray,
          author: user._id,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div className="flex justify-center p-8">Loading user data...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">What's on your mind?</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your farming updates..."
                required
                rows={5}
                maxLength={2000}
              />
            </div>

            {/* Media Upload Sections */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Add Images (Max 10)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {media.images.map((img) => (
                    <div key={img} className="relative w-24 h-24">
                      <img
                        src={img}
                        alt="Post preview"
                        className="rounded-md object-cover w-full h-full border"
                      />
                    </div>
                  ))}
                </div>
                <Label
                  htmlFor="images"
                  className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-800"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5" />
                      <span>Upload Images</span>
                    </>
                  )}
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleMediaUpload(e, 'images')}
                    disabled={isLoading || media.images.length >= 10}
                  />
                </Label>
              </div>

              <div className="space-y-2">
                <Label>Add Videos (Max 3)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {media.videos.map((video) => (
                    <div key={video} className="relative w-24 h-24 flex items-center justify-center bg-gray-100 rounded-md">
                      <Video className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
                <Label
                  htmlFor="videos"
                  className="flex items-center justify-center gap-2 border-2 border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-800"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Video className="h-5 w-5" />
                      <span>Upload Videos</span>
                    </>
                  )}
                  <Input
                    id="videos"
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleMediaUpload(e, 'videos')}
                    disabled={isLoading || media.videos.length >= 3}
                  />
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  placeholder="e.g. Wheat, Corn"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. organic, harvest, irrigation"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}