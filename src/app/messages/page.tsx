"use client";

import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/useUserData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, MessageSquare, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface Conversation {
  _id: string;
  participants: {
    _id: string;
    name: string;
    profilePicture?: string;
  }[];
  lastMessage: {
    content: string;
    sender: string;
    createdAt: string;
  };
  unreadCount: number;
}

interface Connection {
  _id: string;
  name: string;
  profilePicture?: string;
}

export default function MessagesPage() {
  const { user } = useUserData();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("conversations");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [conversationsRes, connectionsRes] = await Promise.all([
          fetch("/api/messages/conversations"),
          fetch("/api/connections"),
        ]);

        if (!conversationsRes.ok || !connectionsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const conversationsData = await conversationsRes.json();
        const connectionsData = await connectionsRes.json();

        setConversations(conversationsData);
        setConnections(connectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const filteredConversations = conversations.filter((conversation) => {
    const otherParticipant = conversation.participants.find(
      (p) => p._id !== user?.id
    );
    return otherParticipant?.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search messages or connections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-4">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(
                    (p) => p._id !== user?.id
                  );
                  return (
                    <Button
                      key={conversation._id}
                      variant="ghost"
                      className="w-full justify-start p-4 hover:bg-accent relative"
                      onClick={() => window.location.href = `/messages/${otherParticipant?._id}`}
                    >
                      <Avatar className="mr-3">
                        {otherParticipant?.profilePicture ? (
                          <AvatarImage src={otherParticipant.profilePicture} />
                        ) : (
                          <AvatarFallback>
                            {otherParticipant?.name?.charAt(0)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{otherParticipant?.name}</span>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(
                              new Date(conversation.lastMessage.createdAt),
                              { addSuffix: true }
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {filteredConnections.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? "No connections found" : "No connections yet"}
                </div>
              ) : (
                filteredConnections.map((connection) => (
                  <Button
                    key={connection._id}
                    variant="ghost"
                    className="w-full justify-start p-4 hover:bg-accent"
                    onClick={() => window.location.href = `/messages/${connection._id}`}
                  >
                    <Avatar className="mr-3">
                      {connection.profilePicture ? (
                        <AvatarImage src={connection.profilePicture} />
                      ) : (
                        <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 text-left">
                      <span className="font-medium">{connection.name}</span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
} 