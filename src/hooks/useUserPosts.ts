import { useEffect, useState } from "react";
import { Post as PostType } from "@/models/Post";

export function useUserPosts(userId: string | undefined) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/posts/user/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user posts");
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error("Error fetching user posts:", message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  const deletePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Remove the deleted post from the state
      setPosts(posts.filter(post => post._id !== postId));
      return true;
    } catch (err) {
      console.error('Error deleting post:', err);
      return false;
    }
  };

  return { posts, loading, error, deletePost };
}
