import { fetchApi } from './client';

export interface Notification {
  _id: string;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const getNotifications = (params?: { limit?: number; cursor?: string; unreadOnly?: boolean }) => {
  const query = new URLSearchParams();
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.cursor) query.set('cursor', params.cursor);
  if (params?.unreadOnly) query.set('unreadOnly', 'true');
  return fetchApi<NotificationListResponse>(`/api/v1/notifications?${query.toString()}`);
};

export const markNotificationRead = (notificationId: string) =>
  fetchApi<Notification>(`/api/v1/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });

export const markAllNotificationsRead = () =>
  fetchApi<{ modifiedCount: number }>('/api/v1/notifications/read-all', {
    method: 'PATCH',
  });
