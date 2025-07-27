import { useEffect, useState } from "react";
import { useUserData } from "./useUserData";
import { SafeUser } from "@/types/User";

export function useSuggestedConnections() {
  const { user } = useUserData();
  const [suggestedUsers, setSuggestedUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await fetch('/api/users/suggested');
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestedUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [user]);

  return { suggestedUsers, loading, error };
}