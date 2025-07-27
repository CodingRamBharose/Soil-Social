"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export function useConnections() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { update: updateSession } = useSession();

  const handleRequest = async (
    url: string,
    action: "send" | "accept" | "remove"
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMessage = 
          data.message || 
          data.error || 
          response.statusText || 
          `Failed to ${action} connection`;
        throw new Error(errorMessage);
      }

      await updateSession();
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Error ${action}ing connection`;
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = (targetUserId: string) => 
    handleRequest(`/api/users/${targetUserId}/connections`, "send");

  const acceptRequest = (requesterId: string) =>
    handleRequest(`/api/users/${requesterId}/connections/accept`, "accept");

  const removeConnection = (userId: string) =>
    handleRequest(`/api/users/${userId}/connections/remove`, "remove");

  return { 
    sendRequest, 
    acceptRequest,
    removeConnection,
    loading, 
    error,
    clearError: () => setError(null) 
  };
}