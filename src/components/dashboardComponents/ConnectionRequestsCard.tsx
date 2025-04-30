"use client";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useConnections } from "@/hooks/useConnections";
import { useUserData } from "@/hooks/useUserData";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function ConnectionRequestsCard() {
  const { user } = useUserData();
  const { 
    sendRequest, 
    acceptRequest, 
    loading, 
    error,
    clearError 
  } = useConnections();

  if (!user?.connectionRequests?.received?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Requests</CardTitle>
        <CardDescription>Pending requests from other farmers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {user.connectionRequests.received.map((request: any) => (
          <div key={request._id} className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <Avatar>
                {request.profilePicture ? (
                  <AvatarImage src={request.profilePicture} />
                ) : (
                  <AvatarFallback>{request.name?.charAt(0) || 'F'}</AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">{request.name}</p>
                <p className="text-sm text-gray-500">
                  {request.cropsGrown?.slice(0, 2).join(', ')}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => acceptRequest(request._id)}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
            </Button>
          </div>
        ))}
        <Button variant="outline" className="w-full mt-2" asChild>
          <Link href="/network/requests">View all requests</Link>
        </Button>
      </CardContent>
    </Card>
  );
}