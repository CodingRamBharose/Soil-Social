"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { ClientNotification } from '@/types/notification';
import { useUserData } from '@/hooks/useUserData';
import { io, Socket } from 'socket.io-client';

type NotificationContextType = {
  notifications: ClientNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  addNotification: (notification: ClientNotification) => void;
  isConnected: boolean;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useUserData();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3000';

    if (!socketRef.current) {
      const newSocket = io(socketUrl, {
        query: { userId: user.id },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setLoading(false);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', () => {
        setIsConnected(false);
        setLoading(false);
      });

      newSocket.on('notification', (notif: ClientNotification) => {
        setNotifications((prev) => [notif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on(
        'notifications',
        (data: { notifications: ClientNotification[]; unreadCount: number }) => {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount);
          setLoading(false);
        }
      );

      socketRef.current = newSocket;
    }

    return () => {
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [user?.id]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      socketRef.current?.emit('markAsRead', id);
    } catch {
      console.error('Failed to mark notification as read');
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      console.error('Failed to mark all notifications as read');
    }
  }, []);

  const addNotification = useCallback((notification: ClientNotification) => {
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
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
        isConnected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
