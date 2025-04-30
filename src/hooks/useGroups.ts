import { useState, useEffect } from 'react';

interface Group {
  _id: string;
  name: string;
  description: string;
  cropType: string;
  createdBy: {
    name: string;
  };
  members: Array<{
    user: {
      name: string;
    };
  }>;
}

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('/api/groups');
        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }
        const data = await response.json();
        setGroups(data.groups);
        setJoinedGroups(data.joinedGroups || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  return { groups, joinedGroups, loading, error };
} 