"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventType } from "@/models/event";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/cloudinary";
import { toast } from "sonner";

export default function CreateEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "",
    startDate: "",
    endDate: "",
    location: {
      address: "",
      coordinates: [0, 0],
    },
    maxAttendees: "",
    tags: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "location") {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.eventType || 
          !formData.startDate || !formData.endDate || !formData.location.address) {
        toast.error("Please fill in all required fields");
        return;
      }

      let imageUrl = "";
      if (formData.image) {
        try {
          imageUrl = await uploadImage(formData.image);
        } catch (error) {
          console.error("Error uploading image:", error);
          toast.error("Failed to upload image");
          return;
        }
      }

      const eventData = {
        title: formData.title,
        description: formData.description,
        eventType: formData.eventType,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        location: {
          address: formData.location.address,
          coordinates: [0, 0] // Default coordinates
        },
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        imageUrl
      };

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create event");
      }

      toast.success("Event created successfully!");
      router.push("/events");
      router.refresh();
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type *</Label>
                <Select
                  value={formData.eventType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, eventType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  min="1"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time *</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Enter event location or address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Enter tags separated by commas"
              />
              <p className="text-sm text-gray-500">
                Example: organic, workshop, sustainable
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p className="text-sm text-gray-500">
                Maximum file size: 5MB
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 