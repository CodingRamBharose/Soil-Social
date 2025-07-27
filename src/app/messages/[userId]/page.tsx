"use client";

import { useState, useEffect, useRef } from "react";
import { useUserData } from "@/hooks/useUserData";
import { useSocket } from "@/context/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  receiver: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  content: string;
  read: boolean;
  createdAt: string;
}

interface ChatPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { user } = useUserData();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<{
    _id: string;
    name: string;
    profilePicture?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    }
    getParams();
  }, [params]);

  useEffect(() => {
    if (!userId || !user?.id) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data.messages);
        setOtherUser(data.otherUser);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id, userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.on("message", (message: Message) => {
        if (
          (message.sender._id === userId &&
            message.receiver._id === user?.id) ||
          (message.sender._id === user?.id &&
            message.receiver._id === userId)
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket, userId, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.id || !userId) return;

    try {
      const response = await fetch(`/api/messages/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      if (socket) {
        socket.emit("message", message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Avatar>
          {otherUser?.profilePicture ? (
            <AvatarImage src={otherUser.profilePicture} />
          ) : (
            <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <h1 className="text-2xl font-bold">{otherUser?.name}</h1>
      </div>

      <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender._id === user?.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender._id === user?.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
} 