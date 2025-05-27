import React, { useState, useEffect } from "react";
import ReactOtpInput from "react-otp-input";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isError?: boolean;
  phoneNumber: string;
  timeLeft: number;
  attemptsLeft: number;
  onResendClick: () => void;
  verifyLoading: boolean;
  resendLoading: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  isError = false,
  phoneNumber,
  timeLeft,
  attemptsLeft,
  onResendClick,
  verifyLoading,
  resendLoading,
}) => {
  const [otp, setOtp] = useState("");
  const isDisabled = timeLeft > 0 && attemptsLeft === 0;

  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Reset OTP on error
  useEffect(() => {
    if (isError) {
      setOtp("");
    }
  }, [isError]);

  // Trigger completion callback when OTP is fully entered
  useEffect(() => {
    if (otp.length === length) {
      onComplete(otp);
    }
  }, [otp, length, onComplete]);

  return (
    <div className="space-y-4">
      <div className={`${isDisabled ? "opacity-50" : ""}`}>
        <ReactOtpInput
          value={otp}
          onChange={setOtp}
          numInputs={length}
          renderInput={(props) => (
            <input
              {...props}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isDisabled || verifyLoading}
              className={`
                w-12 h-12 text-2xl rounded-md text-center outline-none border
                ${isError ? "border-error" : "border-gray-300"}
                ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
                focus:border-primary focus:ring-primary
              `}
              style={{ direction: "ltr" }}
            />
          )}
          containerStyle="flex flex-row-reverse justify-between gap-1 md:gap-2 lg:gap-4"
        />
      </div>

      {isError && (
        <p className="text-error text-sm">
          کد تایید اشتباه است. تعداد تلاش‌های باقی‌مانده: {attemptsLeft}
        </p>
      )}

      {verifyLoading && (
        <p className="text-primary text-sm">در حال تایید کد...</p>
      )}

      {resendLoading && (
        <p className="text-primary text-sm">در حال ارسال مجدد کد...</p>
      )}

      <div className="flex justify-between items-center">
        {timeLeft > 0 ? (
          <p className="text-warning text-sm">
            لطفاً {formatTime(timeLeft)} دیگر دوباره تلاش کنید
          </p>
        ) : (
          <button
            onClick={onResendClick}
            className="text-primary text-sm hover:underline disabled:text-gray-400 disabled:no-underline"
            disabled={resendLoading || attemptsLeft === 0}
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  );
};
