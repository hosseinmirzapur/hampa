import React, { useState, useEffect } from "react"; // Import useEffect
import { useAuth } from "../contexts/AuthContext";
import { ProfileForm } from "../components/profile/ProfileForm";
import { LogOut } from "lucide-react";
import { ConfirmationModal } from "../components/modals/ConfirmationModal";
import { toast } from "react-toastify";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../graphql/user.graphql";

const Profile: React.FC = () => {
  const { user: authUser, isAuthenticated, updateUser, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Fetch current user profile from backend
  const { data, loading, error, refetch } = useQuery(GET_CURRENT_USER, {
    // Get refetch
    skip: true, // Always skip initially
  });

  // Refetch when isAuthenticated becomes true
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  const user = data?.me || authUser;

  if (loading || !isAuthenticated) {
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

  if (error) {
    // Handle error state
    toast.error("خطا در بارگذاری اطلاعات پروفایل: " + error.message);
    return (
      <div className="container mx-auto px-4 py-6">
        <p className="text-error text-center">خطا در بارگذاری پروفایل.</p>
      </div>
    );
  }

  const handleProfileUpdate = async (
    name: string,
    birthDate: string | null
  ) => {
    setIsUpdating(true);

    try {
      // This will now call the backend via AuthContext's updateUser
      await updateUser({
        name,
        // birthDate: birthDate, // birthDate is not in UserProfileType, will handle this later if needed
      });

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
