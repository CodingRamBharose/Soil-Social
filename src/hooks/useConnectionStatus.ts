import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useConnectionStatus(targetUserId: string) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<{
    isConnected: boolean;
    requestSent: boolean;
    requestReceived: boolean;
  }>({
    isConnected: false,
    requestSent: false,
    requestReceived: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      if (!session?.user?.id || !targetUserId) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users/${targetUserId}/connection-status`);
        if (!response.ok) {
          throw new Error('Failed to fetch connection status');
        }
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch connection status');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectionStatus();
  }, [session?.user?.id, targetUserId]);

  return { ...status, isLoading, error };
}