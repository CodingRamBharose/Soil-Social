"use client";
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useUserData } from '@/hooks/useUserData';
import { useSocket } from '@/context/SocketContext';
import { formatDistanceToNow } from 'date-fns';

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

interface ChatInterfaceProps {
  userId: string;
  userName: string;
  userProfilePicture?: string;
}

export function ChatInterface({ userId, userName, userProfilePicture }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUserData();
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/messages/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      if (
        (message.sender._id === userId && message.receiver._id === user?.id) ||
        (message.sender._id === user?.id && message.receiver._id === userId)
      ) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on('message', handleNewMessage);

    return () => {
      socket.off('message', handleNewMessage);
    };
  }, [socket, userId, user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const response = await fetch(`/api/messages/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      if (socket) {
        socket.emit('message', message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b">
        <Avatar>
          {userProfilePicture ? (
            <AvatarImage src={userProfilePicture} />
          ) : (
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h3 className="font-medium">{userName}</h3>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender._id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender._id === user?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 