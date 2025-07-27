"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUserData } from "@/hooks/useUserData";
import { ConnectionCard } from "@/components/dashboardComponents/ConnectionCard";
import { Button } from "@/components/ui/button";
import { useConnections } from "@/hooks/useConnections";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ConnectionRequestsPage() {
  const { user, refreshUserData } = useUserData();
  const { acceptRequest, loading, clearError } = useConnections();

  const handleAccept = async (requesterId: string) => {
    clearError();
    const result = await acceptRequest(requesterId);
    if (!result.error) {
      await refreshUserData();
      toast.success("Connection accepted");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>
            Connection Requests ({user?.connectionRequests?.received?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(user?.connectionRequests?.received?.length || 0) > 0 ? (
            user.connectionRequests?.received?.map((request: any) => (
              <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg">
                <ConnectionCard user={request} />
                <Button
                  onClick={() => handleAccept(request._id)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 space-y-2">
              <p className="text-gray-500">No pending connection requests</p>
              <Button variant="link" onClick={() => refreshUserData()}>
                Check for new requests
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}