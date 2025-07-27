// hooks/useUserData.ts
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { SafeUser } from "@/types/user";

export function useUserData() {
  const { data: session, update: updateSession } = useSession();
  const [userData, setUserData] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/profile');
      
      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      console.error('Failed to fetch user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchUserData();
    }
  }, [session?.user]);

  const user = {
    ...session?.user,
    ...userData
  };

  const refreshUserData = async () => {
    await fetchUserData();
    await updateSession();
  };

  return { 
    user, 
    isLoading, 
    error, 
    refreshUserData,
    updateSession
  };
}