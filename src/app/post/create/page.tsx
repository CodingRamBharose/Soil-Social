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
// Add these imports for the Select and Checkbox components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Add crop options
const crops = [
  { value: "wheat", label: "Wheat" },
  { value: "rice", label: "Rice" },
  { value: "corn", label: "Corn" },
  { value: "soybean", label: "Soybean" },
  { value: "cotton", label: "Cotton" },
  { value: "sugarcane", label: "Sugarcane" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
];

// Add tag options
const techniques = [
  { value: "organic", label: "Organic Farming" },
  { value: "permaculture", label: "Permaculture" },
  { value: "hydroponics", label: "Hydroponics" },
  { value: "precision", label: "Precision Agriculture" },
  { value: "sustainable", label: "Sustainable" },
  { value: "pesticide-free", label: "Pesticide Free" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "soil-health", label: "Soil Health" },
];

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
  // Add state for selected tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: formData.content,
          images: media.images,
          videos: media.videos,
          cropType: formData.cropType,
          tags: selectedTags, // Use the selected tags array
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
              <Label htmlFor="content">What&apos;s on your mind?</Label>
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
                {/* Crop type dropdown */}
                <Select
                  value={formData.cropType}
                  onValueChange={(value) => setFormData({ ...formData, cropType: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                {/* Tags dropdown with checkboxes */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      disabled={isLoading}
                    >
                      {selectedTags.length > 0
                        ? `${selectedTags.length} selected`
                        : "Select tags"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-2">
                    <div className="space-y-2">
                      {techniques.map((tech) => (
                        <div key={tech.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tech-${tech.value}`}
                            checked={selectedTags.includes(tech.value)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? setSelectedTags([...selectedTags, tech.value])
                                : setSelectedTags(
                                    selectedTags.filter((v) => v !== tech.value)
                                  );
                            }}
                          />
                          <label htmlFor={`tech-${tech.value}`}>{tech.label}</label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
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
