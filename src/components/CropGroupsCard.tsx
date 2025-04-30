import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import GroupForm from './GroupForm';
import { CropGroup } from '@/models/CropGroup';

interface GroupResponse extends Omit<CropGroup, '_id'> {
  _id: string;
}

export default function CropGroupsCard() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [groups, setGroups] = useState<GroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to join group');
      }
      fetchGroups(); // Refresh groups list
    } catch (err) {
      setError('Failed to join group');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Crop Groups</h2>
        {session && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Create Group
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">Loading groups...</div>
      ) : groups.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No groups available. {session && 'Create a new group to get started!'}
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{group.name}</h3>
                  <p className="text-gray-600 text-sm">{group.description}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Crop Type: {group.cropType}
                  </p>
                  <p className="text-gray-500 text-xs">
                    Members: {group.members.length}
                  </p>
                </div>
                {session && !group.members.some(
                  (member) => member.user.toString() === session.user.id
                ) && (
                  <button
                    onClick={() => handleJoinGroup(group._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Join Group
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <GroupForm onClose={() => setShowForm(false)} />}
    </div>
  );
} 