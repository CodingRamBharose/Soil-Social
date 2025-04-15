
import { useEffect, useState } from "react";
import { Post as PostType } from "@/models/Post";

export function usePosts() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error("Error fetching posts:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
}
