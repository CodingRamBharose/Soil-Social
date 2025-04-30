"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentDots, FaRegShareFromSquare } from "react-icons/fa6";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useConnections } from "@/hooks/useConnections";
import { useUserData } from "@/hooks/useUserData";
import { CommentSection } from "./CommentSection";
import { toast } from "sonner";

export function PostCard({ post }: { post: any }) {
  const { user: currentUser } = useUserData();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Add null checks for post.author
  const { isConnected, isLoading: statusLoading } = useConnectionStatus(post.author?._id || "");
  const { removeConnection, sendRequest, loading } = useConnections();

  // Check if current user has liked the post
  useEffect(() => {
    if (currentUser?._id && post.likes) {
      const userLiked = post.likes.some((likeId: string) => likeId === currentUser._id);
      setIsLiked(userLiked);
    }
  }, [currentUser, post.likes]);

  const handleConnection = async () => {
    try {
      if (!post.author?._id) return;

      if (isConnected) {
        await removeConnection(post.author._id);
      } else {
        await sendRequest(post.author._id);
      }
    } catch (err) {
      console.error("Connection action failed:", err);
    }
  };

  const handleLike = async () => {
    try {
      if (!currentUser) {
        toast.error("You must be logged in to like posts");
        return;
      }

      setIsLikeLoading(true);

      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      } else {
        toast.error(data.error || "Failed to like post");
      }
    } catch (err) {
      console.error("Like action failed:", err);
      toast.error("Failed to like post");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Don't show button if it's the current user's post or if author doesn't exist
  const isCurrentUser = currentUser?._id === post.author?._id;
  const authorExists = !!post.author;

  if (!authorExists) {
    return null; // Don't render the post if author doesn't exist
  }

  return (
    <div className="border-2 border-white p-4 rounded-md shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-start gap-2">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
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

          {!isCurrentUser && (
            <Button
              className="bg-green-600"
              variant={isConnected ? "outline" : "default"}
              size="sm"
              onClick={handleConnection}
              disabled={statusLoading || loading}
            >
              {statusLoading || loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isConnected ? (
                <UserMinus className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
              <span className="ml-2">
                {isConnected ? "Connected" : "Connect"}
              </span>
            </Button>
          )}
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLikeLoading}
              className={isLiked ? "text-green-600" : ""}
            >
              <div className="flex items-center">
                {isLiked ? (
                  <AiFillLike className="h-4 w-4" />
                ) : (
                  <AiOutlineLike className="h-4 w-4" />
                )}
                <span className="ml-2">{likesCount}</span>
                <span className="ml-1">Like</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleComments}
            >
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

          {showComments && (
            <CommentSection postId={post._id} />
          )}
        </div>
      </div>
    </div>
  );
}