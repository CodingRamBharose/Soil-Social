"use client";
import { useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, Loader2, UserCheck, UserX } from "lucide-react";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { useConnections } from "@/hooks/useConnections";
import { toast } from "sonner";

interface User {
  id: string;
  name?: string;
  profilePicture?: string;
  cropsGrown?: string[];
}

export function ConnectionCard({ user }: { user: User }) {
  const { 
    isConnected, 
    requestSent, 
    requestReceived, 
    isLoading: statusLoading 
  } = useConnectionStatus(user.id);
  
  const { 
    sendRequest, 
    acceptRequest,
    removeConnection,
    loading, 
    error,
    clearError 
  } = useConnections();

  const handleAction = useCallback(async () => {
    clearError();
    try {
      if (isConnected) {
        await removeConnection(user.id);
        toast.success("Connection removed");
      } else if (requestReceived) {
        await acceptRequest(user.id);
        toast.success("Connection accepted");
      } else {
        await sendRequest(user.id);
        toast.success("Request sent");
      }
    } catch {
      toast.error(error || "Action failed");
    }
  }, [clearError, isConnected, removeConnection, user.id, requestReceived, acceptRequest, sendRequest, error]);

  return (
    <div className="flex items-center justify-between gap-3 p-2 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="w-10 h-10">
          {user.profilePicture ? (
            <AvatarImage src={user.profilePicture} />
          ) : (
            <AvatarFallback>{user.name?.charAt(0) || 'F'}</AvatarFallback>
          )}
        </Avatar>
        <div className="overflow-hidden">
          <p className="font-medium truncate">{user.name || 'Farmer'}</p>
          <p className="text-sm text-gray-500 truncate">
            {user.cropsGrown?.slice(0, 2).join(', ') || 'Various crops'}
          </p>
        </div>
      </div>
      
      <Button
        variant={isConnected ? "outline" : requestSent ? "outline" : "default"}
        size="sm"
        onClick={handleAction}
        disabled={statusLoading || loading}
      >
        {statusLoading || loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isConnected ? (
          <>
            <UserX className="h-4 w-4 mr-2" />
            Remove
          </>
        ) : requestReceived ? (
          <>
            <UserCheck className="h-4 w-4 mr-2" />
            Accept
          </>
        ) : requestSent ? (
          "Request Sent"
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </>
        )}
      </Button>
    </div>
  );
}