import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { CardForm } from "../components/forms/CardForm";
import { useRunnerCards } from "../hooks/useRunnerCards";
import { DayOfWeek, TimeOfDay } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { OtpInput } from "../components/auth/OtpInput"; // Import OtpInput component
import { toast } from "react-toastify";

const CreateCard: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { createCard } = useRunnerCards();
  const {
    user,
    login,
    verifyOtp,
    phoneVerification,
    isLoading: isAuthLoading,
  } = useAuth(); // Get isAuthLoading
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "otp-verification">("form");
  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    days: DayOfWeek[];
    time: TimeOfDay;
    phoneNumber: string;
    isPhoneNumberPublic: boolean;
  } | null>(null);

  // Effect to handle navigation after successful OTP verification
  useEffect(() => {
    if (user && formData && step === "otp-verification") {
      // User is now authenticated after OTP verification, proceed with card creation
      const card = createCard(
        formData.name,
        formData.location,
        formData.days,
        formData.time,
        formData.phoneNumber,
        formData.isPhoneNumberPublic
      );

      if (card) {
        navigate(`/app/cards/${card.id}`); // Navigate to card details page
      } else {
        toast.error("خطا در ایجاد کارت");
        setIsCreating(false);
      }
    }
  }, [user, formData, step, createCard, navigate]); // Add dependencies

  const handleFormSubmit = async (
    name: string,
    location: string,
    days: DayOfWeek[],
    time: TimeOfDay,
    phoneNumber: string,
    isPhoneNumberPublic: boolean
  ) => {
    setIsCreating(true);

    // Store form data for later use after OTP verification if needed
    setFormData({
      name,
      location,
      days,
      time,
      phoneNumber,
      isPhoneNumberPublic,
    });

    try {
      // Check if the user is logged in and using the same phone number
      if (user && user.phoneNumber === phoneNumber) {
        // User is logged in and using their verified phone number
        const card = createCard(
          name,
          location,
          days,
          time,
          phoneNumber,
          isPhoneNumberPublic
        );

        if (card) {
          navigate(`/app/cards/${card.id}`); // Navigate to card details page
        } else {
          toast.error("خطا در ایجاد کارت");
          setIsCreating(false);
        }
      } else {
        // User is either not logged in or using a different phone number
        // Need to verify the phone number with OTP
        await login(phoneNumber);
        setStep("otp-verification");
      }
    } catch (error) {
      console.error("Error creating card:", error);
      toast.error("خطا در ایجاد کارت");
      setIsCreating(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    if (!formData) return;

    try {
      await verifyOtp(otp);
      // The useEffect hook will handle navigation after successful verification
    } catch (error) {
      console.error("OTP verification error:", error);
      // Handle OTP verification error (e.g., show error message)
    }
  };

  const handleResendOtp = () => {
    if (formData) {
      login(formData.phoneNumber);
    }
  };

  // Show loading state if authentication is in progress
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

        {step === "form" ? (
          <CardForm onSubmit={handleFormSubmit} isLoading={isCreating} />
        ) : (
          <div className="space-y-6">
            <p className="text-center">
              برای تایید شماره تلفن، کد تایید را وارد کنید
            </p>
            <div className="flex justify-center">
              <OtpInput // Use the OtpInput component
                length={6}
                onComplete={handleOtpComplete}
                isError={!!phoneVerification?.error} // Pass error state based on truthiness
                timeLeft={phoneVerification?.timeLeft || 0} // Pass time left
                attemptsLeft={phoneVerification?.attemptsLeft || 0} // Pass attempts left
                onResendClick={handleResendOtp} // Pass resend handler
              />
            </div>
            {phoneVerification?.error && ( // Display OTP error message
              <p className="text-error text-center text-sm">
                {phoneVerification.error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCard;
