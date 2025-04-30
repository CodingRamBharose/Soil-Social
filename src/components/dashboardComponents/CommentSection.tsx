"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user: currentUser } = useUserData();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        const error = await response.json();
        console.error("Failed to fetch comments:", error);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    if (!currentUser) {
      toast.error("You must be logged in to comment");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prevComments => [comment, ...prevComments]);
        setNewComment("");
        toast.success("Comment added successfully");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-medium mb-3">Comments</h3>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-4">
        <div className="flex gap-2">
          <Avatar className="h-8 w-8">
            {currentUser?.profilePicture ? (
              <AvatarImage src={currentUser.profilePicture} />
            ) : (
              <AvatarFallback>
                {currentUser?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] mb-2"
              maxLength={1000}
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                size="sm"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Posting...
                  </>
                ) : (
                  "Post Comment"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments list */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-2">
              <Avatar className="h-8 w-8">
                {comment.author.profilePicture ? (
                  <AvatarImage src={comment.author.profilePicture} />
                ) : (
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="font-medium text-sm">{comment.author.name}</div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
}
