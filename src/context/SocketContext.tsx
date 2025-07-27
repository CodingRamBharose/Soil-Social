"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUserData } from '@/hooks/useUserData';
import { useNotifications } from '@/context/NotificationContext';
import { ClientNotification } from '@/types/notification';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserData();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';
    const newSocket = io(socketUrl, {
      query: { userId: user.id },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', () => {
      setIsConnected(false);
    });

    newSocket.on('newMessage', (message: {
      _id: string;
      sender: {
        _id: string;
        name: string;
        profilePicture?: string;
      };
      content: string;
    }) => {
      if (message.sender?._id !== user.id && user.id) {
        const notification: ClientNotification = {
          _id: message._id,
          user: user.id,
          sender: {
            _id: message.sender._id,
            name: message.sender.name,
            profilePicture: message.sender.profilePicture,
          },
          type: 'message',
          relatedId: message._id,
          read: false,
          content: `${message.sender.name}: ${message.content}`,
          createdAt: new Date().toISOString(),
        };
        addNotification(notification);
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
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
}
