// types/notification.ts

export type NotificationType =
  | 'connection'
  | 'like'
  | 'comment'
  | 'message'
  | 'event'
  | 'marketplace';

export interface SenderInfo {
  _id: string;
  name: string;
  profilePicture?: string;
}

export interface ClientNotification {
  _id: string;
  user: string;
  sender?: SenderInfo;
  type: NotificationType;
  relatedId?: string;
  read: boolean;
  content: string;
  createdAt: string;
}
