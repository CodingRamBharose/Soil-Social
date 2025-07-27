"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionCard } from "@/components/dashboardComponents/ConnectionCard";
import { useUserData } from "@/hooks/useUserData";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestedUser {
  _id: string;
  name: string;
  profilePicture?: string;
  cropsGrown?: string[];
  location?: string;
}

export default function NetworkPage() {
  const { user } = useUserData();
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState({
    connections: false,
    suggestions: false
  });

  const fetchSuggestions = async () => {
    try {
      setLoading(prev => ({ ...prev, suggestions: true }));
      const response = await fetch('/api/users/suggested');
      const data = await response.json();
      setSuggestedUsers(data.filter((s: SuggestedUser) =>
        !user?.connections?.some((c: any) => (typeof c === 'string' ? c : c._id) === s._id)
      ));
    } finally {
      setLoading(prev => ({ ...prev, suggestions: false }));
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [user?.connections, fetchSuggestions]);

  if (!user) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="connections">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections">Your Connections</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Your Farming Network ({user.connections?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(user.connections?.length || 0) > 0 ? (
                user.connections?.map((connection: any) => (
                  <ConnectionCard key={connection._id || connection} user={{ ...connection, id: connection._id || connection }} />
                ))
              ) : (
                <div className="text-center py-8 space-y-2">
                  <p className="text-gray-500">No connections yet</p>
                  <Button variant="link" onClick={() => fetchSuggestions()}>
                    Find farmers to connect with
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Suggested Farmers</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchSuggestions}
                disabled={loading.suggestions}
              >
                <RefreshCw className={`h-4 w-4 ${loading.suggestions ? 'animate-spin' : ''}`} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading.suggestions ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : suggestedUsers.length > 0 ? (
                suggestedUsers.map((user) => (
                  <ConnectionCard key={user._id} user={{ ...user, id: user._id }} />
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No suggestions available. Try refreshing.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}