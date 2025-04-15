"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { formatDistanceToNow } from "date-fns";

export function PostCard({ post }: { post: any }) {
  return (
    <div className="border-b pb-4">
      <div className="flex items-start gap-3">
        <Avatar>
          {post.author?.profilePicture ? (
            <AvatarImage src={post.author.profilePicture} />
          ) : (
            <AvatarFallback>
              {post.author?.name?.charAt(0) || 'F'}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <p className="font-medium">{post.author?.name || "Farmer"}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
          <p className="mt-2">{post.content}</p>
          
          {/* Display images if they exist */}
          {post.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-3">
              {post.images.map((image: string) => (
                <div key={image} className="relative aspect-square">
                  <CldImage
                    src={image}
                    alt="Post image"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Display tags if they exist */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {post.tags.map((tag: string) => (
                <span 
                  key={tag} 
                  className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-3">
            <Button variant="ghost" size="sm">
              👍 {post.likes?.length || 0}
            </Button>
            <Button variant="ghost" size="sm">
              💬 {post.comments?.length || 0}
            </Button>
            <Button variant="ghost" size="sm">
              🔄 Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}