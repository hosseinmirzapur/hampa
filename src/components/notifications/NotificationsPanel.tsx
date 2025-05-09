import React, { useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { formatRelativeTime } from '../../utils/dateUtils';

interface NotificationsPanelProps {
  onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const { notifications, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close panel when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleNotificationClick = (id: string, relatedCardId?: string) => {
    markAsRead(id);
    if (relatedCardId) {
      navigate(`/cards/${relatedCardId}`);
      onClose();
    }
  };

  return (
    <div 
      ref={panelRef}
      className="absolute top-10 left-0 w-80 max-h-96 bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-200 animate-fade-in"
      style={{ right: '-200px' }}
    >
      <div className="flex items-center justify-between bg-primary text-white p-3">
        <h3 className="font-semibold">اعلان‌ها</h3>
        <div className="flex items-center">
          {notifications.length > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-white hover:text-gray-200 transition-colors p-1 ml-2" 
              title="خواندن همه"
            >
              <Check size={16} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1" 
          >
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            اعلان جدیدی ندارید
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <li 
                key={notification.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleNotificationClick(notification.id, notification.relatedCardId)}
              >
                <div className="flex flex-col">
                  <p className="text-sm leading-5 mb-1">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {formatRelativeTime(notification.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;