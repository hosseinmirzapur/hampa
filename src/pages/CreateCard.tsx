import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardForm } from "../components/forms/CardForm";
import { DayOfWeek, TimeOfDay } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useRunnerCards } from "../hooks/useRunnerCards";

const CreateCard: React.FC = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const { createCard } = useRunnerCards();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  const handleFormSubmit = async (
    title: string,
    location: string,
    days: DayOfWeek[],
    time: TimeOfDay,
    phoneNumber: string,
    isPhoneNumberPublic: boolean
  ) => {
    setIsSubmittingForm(true);
    try {
      if (!user) {
        // This case should ideally not happen based on user's description
        // but added for robustness. If not logged in, redirect to login.
        toast.error("برای ایجاد کارت باید وارد شوید.");
        navigate("/login");
        return;
      }

      // Proceed directly with card creation as OTP is not part of this flow
      const newCard = await createCard({
        title,
        location,
        days,
        time,
        phoneNumber,
        isPhoneNumberPublic,
      });
      if (newCard) {
        toast.success("کارت با موفقیت ایجاد شد");
        navigate(`/app/cards/${newCard.id}`);
      } else {
        toast.error("خطا در ایجاد کارت");
      }
    } catch (error: any) {
      console.error("Error during card creation:", error);
      toast.error("خطا در ایجاد کارت: " + error.message);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">ایجاد کارت جدید</h1>
        <CardForm
          onSubmit={handleFormSubmit}
          isLoading={isSubmittingForm || isAuthLoading}
        />
      </div>
    </div>
  );
};

export default CreateCard;
