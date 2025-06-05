import React from "react";
import { NavLink } from "react-router-dom";
import { User, MapPin, Users, CreditCard } from "lucide-react";

export const BottomNavigation: React.FC = () => {
  // Define navigation items
  const navItems = [
    {
      to: "/app/profile",
      icon: <User size={20} />,
      label: "پروفایل",
    },
    {
      to: "/app/explore",
      icon: <MapPin size={20} />,
      label: "اکسپلور",
    },
    {
      to: "/app/runners",
      icon: <Users size={20} />,
      label: "لیست دونده‌ها",
    },
    {
      to: "/app/my-cards",
      icon: <CreditCard size={20} />,
      label: "کارت‌های من",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white shadow-lg border-t border-gray-200 dark:bg-neutral-dark dark:border-neutral-700">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-1/4 py-1 transition-colors duration-200 ${
                isActive
                  ? "text-primary dark:text-primary-light"
                  : "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary-light"
              }`
            }
          >
            <div className="relative">{item.icon}</div>
            <span className="text-xs mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
