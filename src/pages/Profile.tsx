import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { ProfileForm } from "../components/profile/ProfileForm";
import { LogOut } from "lucide-react";
import { ConfirmationModal } from "../components/modals/ConfirmationModal";
import { toast } from "react-toastify";

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async (
    name: string,
    birthDate: string | null
  ) => {
    setIsUpdating(true);

    try {
      // In a real app, this would send data to the backend
      updateUser({
        name,
        birthDate,
      });

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Show success feedback
      toast.success("اطلاعات پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("خطا در به‌روزرسانی پروفایل");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">پروفایل من</h1>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="btn btn-outline flex items-center"
          >
            <LogOut size={18} />
            <span className="mr-1">خروج</span>
          </button>
        </div>

        <ProfileForm
          user={user}
          onSubmit={handleProfileUpdate}
          isLoading={isUpdating}
        />
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="خروج از حساب کاربری"
        message="آیا از خروج از حساب کاربری خود اطمینان دارید؟"
        confirmText="بله، خارج شوم"
        cancelText="انصراف"
      />
    </div>
  );
};

export default Profile;
