"use client";
import { useNotifications } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { BellDot, BellOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { Notification } from '@/models/Notification';

interface PopulatedNotification extends Notification {
  sender?: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

export default function NotificationPage() {
  const { 
    notifications, 
    unreadCount, 
    markAllAsRead,
    fetchNotifications,
    loading,
    markAsRead
  } = useNotifications();

  const getNotificationLink = (notification: PopulatedNotification) => {
    switch (notification.type) {
      case 'connection':
        return '/network';
      case 'like':
      case 'comment':
        return `/post/${notification.relatedId}`;
      case 'message':
        return '/messages';
      case 'event':
        return `/events/${notification.relatedId}`;
      case 'marketplace':
        return `/marketplace/${notification.relatedId}`;
      default:
        return '#';
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BellDot className="h-6 w-6" />
          Notifications {unreadCount > 0 && `(${unreadCount})`}
        </h1>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark all as read
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={fetchNotifications}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4 text-gray-500">
          <BellOff className="h-12 w-12" />
          <p className="text-lg">No notifications yet</p>
          <p className="text-sm">When you get notifications, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(notifications as PopulatedNotification[]).map((notification) => (
            <Link
              key={notification._id.toString()}
              href={getNotificationLink(notification)}
              onClick={() => !notification.read && markAsRead(notification._id.toString())}
              className={`flex gap-3 p-3 rounded-lg transition-colors ${!notification.read ? 'bg-green-50 dark:bg-green-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <div className="relative flex-shrink-0">
                {notification.sender?.profilePicture ? (
                  <Avatar className="h-10 w-10">
                    <CldImage
                      src={notification.sender.profilePicture}
                      width={40}
                      height={40}
                      alt="Profile"
                      className="rounded-full"
                    />
                  </Avatar>
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {notification.sender?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                )}
                {!notification.read && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-2">{notification.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}