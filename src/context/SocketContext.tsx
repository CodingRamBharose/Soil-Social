"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/context/NotificationContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

interface MessageNotification {
  user: string;
  sender: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  type: 'message';
  relatedId: string;
  read: boolean;
  content: string;
  createdAt: string;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserData();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      query: { userId: user.id },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('newMessage', (message) => {
      if (message.sender._id !== user.id) {
        const notification: MessageNotification = {
          user: user.id,
          sender: message.sender,
          type: 'message',
          relatedId: message._id,
          read: false,
          content: `${message.sender.name}: ${message.content}`,
          createdAt: new Date().toISOString(),
        };
        addNotification(notification as any);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user?.id, addNotification]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
} 