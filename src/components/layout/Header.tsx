import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Bell, BellRing, LogOut, User, Sun, Moon } from "lucide-react"; // Added Sun, Moon
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext"; // Added useTheme
import NotificationsPanel from "../notifications/NotificationsPanel";

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme(); // Added theme and toggleTheme
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount } = useNotification();
  const { logout, isAuthenticated, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get page title based on current path
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/app/profile":
        return "پروفایل";
      case "/app/explore":
        return "اکسپلور";
      case "/app/runners":
        return "لیست دونده‌ها";
      case "/app/my-cards":
        return "کارت‌های من";
      case "/app/joint-runs":
        return "برنامه‌های مشترک";
      case "/app/create-card":
        return "ایجاد کارت جدید";
      default:
        if (location.pathname.startsWith("/app/cards/")) {
          return "جزئیات کارت";
        }
        return "همپا";
    }
  };

  // Check if back button should be shown
  const shouldShowBackButton = () => {
    return ![
      "/app/profile",
      "/app/explore",
      "/app/runners",
      "/app/my-cards",
      "/app/joint-runs",
    ].includes(location.pathname);
  };

  // Handle back button click
  const handleBackClick = () => {
    navigate(-1);
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setShowNotifications(false); // Close notifications if dropdown opens
  };

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm dark:bg-neutral-dark dark:border-b dark:border-neutral-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {shouldShowBackButton() && (
            <button
              onClick={handleBackClick}
              className="p-1 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}
          <h1 className="text-lg font-bold mr-2 dark:text-gray-100">{getPageTitle()}</h1>
        </div>

        {isAuthenticated && (
          <div className="flex items-center space-x-2"> {/* Ensured space-x-2 for spacing */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center p-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light transition-colors rounded-full bg-gray-100 dark:bg-neutral-700 pr-3"
              >
                <User size={20} className="ml-2" />
                <span className="font-medium text-sm dark:text-gray-200">
                  {user?.name || user?.phoneNumber || "کاربر"}{" "}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-20 dark:border dark:border-neutral-700">
                  <div
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                    onClick={() => {
                      setShowNotifications((prev) => !prev);
                      setShowDropdown(false);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center">
                        {unreadCount > 0 ? (
                          <BellRing size={16} className="ml-2" />
                        ) : (
                          <Bell size={16} className="ml-2" />
                        )}
                        اعلانات
                      </span>
                      {unreadCount > 0 && (
                        <span className="flex items-center justify-center w-4 h-4 bg-secondary text-white text-xs rounded-full">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                  >
                    <LogOut size={16} className="ml-2" />
                    خروج
                  </div>
                </div>
              )}
              {showNotifications && (
                <NotificationsPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
