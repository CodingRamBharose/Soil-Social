"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots, FaRegShareFromSquare } from "react-icons/fa6";



export function PostCard({ post }: { post: any }) {
  return (
    <div className="border-2 border-white p-4 rounded-md shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-start gap-2">
        <div className="w-full flex items-center">
          <Avatar>
            {post.author?.profilePicture ? (
              <AvatarImage src={post.author.profilePicture} />
            ) : (
              <AvatarFallback>
                {post.author?.name?.charAt(0) || 'F'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col ml-3">
            <p className="font-medium">{post.author?.name || "Farmer"}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="w-full">
          <p>{post.content}</p>
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
                  className="text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-4 mt-3 border-t pt-3 w-full">
            <Button variant="ghost" size="sm">
              <div className="flex items-center">
                <AiOutlineLike className="h-4 w-4" />
                <span className="ml-2">{post.likes?.length || 0}</span>
                <span className="ml-1">Like</span>
              </div>
            </Button>
            <Button variant="ghost" size="sm">
              <div className="flex items-center">
                <FaRegCommentDots className="h-4 w-4" />
                <span className="ml-2 ">{post.comments?.length || 0}</span>
                <span className="ml-1">Comment</span>
              </div>
            </Button>
            <Button variant="ghost" size="sm">
              <div className="flex items-center">
                <FaRegShareFromSquare className="h-4 w-4" />
                <span className="ml-2">Share</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}