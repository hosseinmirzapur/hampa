import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PhoneInput } from "../components/auth/PhoneInput";
import { OtpInput } from "../components/auth/OtpInput";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const navigate = useNavigate();
  const { login, verifyOtp, phoneVerification, resetVerification } = useAuth();

  const handlePhoneSubmit = async (phoneNumber: string) => {
    // No need for local isSubmitting or error states, use phoneVerification
    try {
      const success = await login(phoneNumber);

      console.log("Login function returned success:", success); // Add this line

      if (success) {
        setStep("otp");
        console.log("Step changed to OTP"); // Add this line
      }
      // Errors are handled by AuthContext and reflected in phoneVerification.error
    } catch (error) {
      console.error("Login error:", error);
      // AuthContext should set phoneVerification.error
    }
  };

  const handleOtpComplete = async (otp: string) => {
    // No need for local isSubmitting or otpError states, use phoneVerification
    try {
      const success = await verifyOtp(otp);

      if (success) {
        navigate("/app");
      }
      // Errors are handled by AuthContext and reflected in phoneVerification.error
    } catch (error) {
      console.error("OTP verification error:", error);
      // AuthContext should set phoneVerification.error
    }
  };

  const handleResendOtp = () => {
    // In a real application, this would trigger sending a new OTP
    login(phoneVerification.phoneNumber);
  };

  const handleBackToPhone = () => {
    resetVerification();
    setStep("phone");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="text-center mb-8 flex flex-col items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/logo.svg" alt="Hampa Logo" className="w-20 h-20 mb-4" />
            <p className="text-gray-600">دوست همراه دویدن</p>
          </div>

          {step === "phone" ? (
            <motion.div
              key="phone-step"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-center mb-4">
                ورود / ثبت‌نام
              </h2>
              <PhoneInput
                onSubmit={handlePhoneSubmit}
                loading={phoneVerification.resendLoading || false}
              />
              {step === "phone" && phoneVerification.error && (
                <p className="text-error text-sm text-center">
                  {phoneVerification.error}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="otp-step"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-center mb-4">
                کد تایید را وارد کنید
              </h2>
              <p className="text-sm text-gray-600 text-center mb-4">
                کد تایید برای شماره {phoneVerification.phoneNumber} ارسال شد
                <br />
                <button
                  onClick={handleBackToPhone}
                  className="text-primary hover:underline mt-1"
                >
                  تغییر شماره موبایل
                </button>
              </p>

              <OtpInput
                onComplete={handleOtpComplete}
                isError={!!phoneVerification.error}
                timeLeft={phoneVerification.timeLeft}
                attemptsLeft={phoneVerification.attemptsLeft}
                onResendClick={handleResendOtp}
                phoneNumber={phoneVerification.phoneNumber}
                verifyLoading={phoneVerification.verifyLoading}
                resendLoading={phoneVerification.resendLoading}
              />

              {step === "otp" && phoneVerification.error && (
                <p className="text-warning text-sm text-center">
                  {phoneVerification.error}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
