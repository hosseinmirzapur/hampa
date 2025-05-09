import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, InterestNotification } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (message: string, relatedCardId?: string, relatedUserId?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  notifyInterest: (notification: InterestNotification) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('hampa-notifications', []);
  const [unreadCount, setUnreadCount] = useState(0);

  // Update unread count whenever notifications change
  useEffect(() => {
    if (user) {
      const userNotifications = notifications.filter(n => n.userId === user.id);
      const count = userNotifications.filter(n => !n.isRead).length;
      setUnreadCount(count);
    } else {
      setUnreadCount(0);
    }
  }, [notifications, user]);

  const addNotification = (message: string, relatedCardId?: string, relatedUserId?: string) => {
    if (!user) return;
    
    const newNotification: Notification = {
      id: uuidv4(),
      userId: user.id,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
      relatedCardId,
      relatedUserId,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const notifyInterest = ({ interestedUserId, interestedUserName, cardId, location, days, time }: InterestNotification) => {
    if (!user) return;
    
    const daysText = days.length > 2 
      ? `${days[0]}، ${days[1]} و ${days.length - 2} روز دیگر` 
      : days.join('، ');
    
    const message = `${interestedUserName} به دویدن با شما در ${location} در ${daysText} (${time}) علاقه‌مند است.`;
    
    addNotification(message, cardId, interestedUserId);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    setNotifications(prev =>
      prev.map(n => (n.userId === user.id ? { ...n, isRead: true } : n))
    );
  };

  const clearNotifications = () => {
    if (!user) return;
    
    setNotifications(prev => prev.filter(n => n.userId !== user.id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: user ? notifications.filter(n => n.userId === user.id) : [],
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        notifyInterest,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};