import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Bell, BellRing } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import NotificationsPanel from '../notifications/NotificationsPanel';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotification();
  const [showNotifications, setShowNotifications] = useState(false);

  // Get page title based on current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/app/profile':
        return 'پروفایل';
      case '/app/explore':
        return 'اکسپلور';
      case '/app/runners':
        return 'لیست دونده‌ها';
      case '/app/my-cards':
        return 'کارت‌های من';
      case '/app/joint-runs':
        return 'برنامه‌های مشترک';
      case '/app/create-card':
        return 'ایجاد کارت جدید';
      default:
        if (location.pathname.startsWith('/app/cards/')) {
          return 'جزئیات کارت';
        }
        return 'همپا';
    }
  };

  // Check if back button should be shown
  const shouldShowBackButton = () => {
    return !['/app/profile', '/app/explore', '/app/runners', '/app/my-cards', '/app/joint-runs'].includes(location.pathname);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1);
  };

  // Toggle notifications panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {shouldShowBackButton() && (
            <button
              onClick={handleBackClick}
              className="p-1 text-gray-700 hover:text-primary transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold mr-2">{getPageTitle()}</h1>
        </div>
        
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="p-2 text-gray-700 hover:text-primary transition-colors relative"
          >
            {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex items-center justify-center w-4 h-4 bg-secondary text-white text-xs rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <NotificationsPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>
      </div>
    </header>
  );
};