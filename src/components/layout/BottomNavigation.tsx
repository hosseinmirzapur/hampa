import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User, MapPin, Users, CreditCard, Bell } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

export const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const { unreadCount } = useNotification();

  // Define navigation items
  const navItems = [
    {
      to: '/app/profile',
      icon: <User size={20} />,
      label: 'پروفایل',
    },
    {
      to: '/app/explore',
      icon: <MapPin size={20} />,
      label: 'اکسپلور',
    },
    {
      to: '/app/runners',
      icon: <Users size={20} />,
      label: 'لیست دونده‌ها',
    },
    {
      to: '/app/my-cards',
      icon: <CreditCard size={20} />,
      label: 'کارت‌های من',
    },
    {
      to: '/app/joint-runs',
      icon: <Bell size={20} />,
      label: 'برنامه‌های مشترک',
      badge: unreadCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-lg border-t border-gray-200">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-1/5 py-1 transition-colors duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`
            }
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -left-1 flex items-center justify-center w-4 h-4 bg-secondary text-white text-xs rounded-full">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};