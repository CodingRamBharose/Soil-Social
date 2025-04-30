"use client";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Notification } from '@/models/Notification';
import { useUserData } from '@/hooks/useUserData';
import { io, Socket } from 'socket.io-client';

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  addNotification: (notification: Notification) => void;
  isConnected: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserData();
  const socketRef = useRef<Socket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.id) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    
    // Only create new socket if one doesn't exist
    if (!socketRef.current) {
      const newSocket = io(socketUrl, {
        query: { userId: user.id },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        console.log('Connected to notification server');
        setIsConnected(true);
        setLoading(false);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from notification server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setIsConnected(false);
      });

      newSocket.on('notification', (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      });

      newSocket.on('notifications', (data: { notifications: Notification[], unreadCount: number }) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
        setLoading(false);
      });

      socketRef.current = newSocket;
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [user?.id]); // Only depend on user.id

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => n._id === id ? { ...n, read: true } as Notification : n)
      );
      setUnreadCount(prev => prev - 1);
      socketRef.current?.emit('markAsRead', id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' });
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true } as Notification))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        loading,
        addNotification,
        isConnected
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}