import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import { CardForm } from "../components/forms/CardForm";
import { DayOfWeek, TimeOfDay } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { OtpInput } from "../components/auth/OtpInput"; // Import OtpInput component
import { toast } from "react-toastify";
import { CREATE_RUNNER_CARD_MUTATION } from "../graphql/runnerCard.graphql"; // Import from graphql file
import { useRunnerCards } from "../hooks/useRunnerCards"; // Ensure this is imported

const CreateCard: React.FC = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState(false); // Renamed for clarity
  const { createCard } = useRunnerCards();
  const {
    user,
    login,
    verifyOtp,
    phoneVerification,
    isLoading: isAuthLoading,
  } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"form" | "otp-verification">("form");
  const [formData, setFormData] = useState<{
    location: string;
    days: DayOfWeek[];
    time: TimeOfDay;
    phoneNumber: string;
    isPhoneNumberPublic: boolean;
  } | null>(null);

  // Effect to handle card creation after successful OTP verification
  useEffect(() => {
    const handleCardCreation = async () => {
      if (user && formData && step === "otp-verification") {
        setIsSubmittingForm(true); // Set loading for card creation
        try {
          const newCard = await createCard({
            location: formData.location,
            days: formData.days,
            time: formData.time,
            phoneNumber: formData.phoneNumber,
            isPhoneNumberPublic: formData.isPhoneNumberPublic,
          });
          if (newCard) {
            toast.success("کارت با موفقیت ایجاد شد");
            navigate(`/app/cards/${newCard.id}`);
          } else {
            toast.error("خطا در ایجاد کارت");
          }
        } catch (error: any) {
          console.error("Error creating card after OTP:", error);
          toast.error("خطا در ایجاد کارت: " + error.message);
        } finally {
          setIsSubmittingForm(false);
        }
      }
    };
    handleCardCreation();
  }, [user, formData, step, createCard, navigate]);

  const handleFormSubmit = async (
    location: string,
    days: DayOfWeek[],
    time: TimeOfDay,
    phoneNumber: string,
    isPhoneNumberPublic: boolean
  ) => {
    setIsSubmittingForm(true); // Set loading for form submission
    setFormData({
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
        const newCard = await createCard({
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
      } else {
        // User is either not logged in or using a different phone number
        // Need to verify the phone number with OTP
        const loginSuccess = await login(phoneNumber);
        if (loginSuccess) {
          setStep("otp-verification");
        } else {
          toast.error("خطا در ارسال کد تایید");
        }
      }
    } catch (error: any) {
      console.error("Error during form submission:", error);
      toast.error("خطا در ایجاد کارت: " + error.message);
    } finally {
      setIsSubmittingForm(false); // Reset loading after form submission attempt
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
          <CardForm
            onSubmit={handleFormSubmit}
            isLoading={isSubmittingForm || isAuthLoading}
          />
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
                phoneNumber={phoneVerification.phoneNumber} // Pass phoneNumber
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
