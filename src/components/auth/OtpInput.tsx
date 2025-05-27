import React, { useState, useEffect } from "react";
import ReactOtpInput from "react-otp-input";
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext'; // Assuming AuthContext exists

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isError?: boolean;
  phoneNumber: string; // Add phoneNumber prop
  timeLeft: number;
  attemptsLeft: number;
  onResendClick: () => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  isError = false,
  phoneNumber, // Destructure phoneNumber
  timeLeft,
  attemptsLeft,
  onResendClick,
}) => {
  const auth = useAuth(); // Use the AuthContext

  const VERIFY_OTP_MUTATION = gql`
    mutation VerifyOtp($input: VerifyOtpInput!) {
      verifyOtp(input: $input) {
        success
        accessToken
        message
      }
    }
  `;
  const RESEND_OTP_MUTATION = gql`
    mutation ResendOtp($input: RequestOtpInput!) {
      resendOtp(input: $input) {
        success
        message
      }
    }
  `;

  const [verifyOtp, { loading: verifyLoading, error: verifyError }] = useMutation(VERIFY_OTP_MUTATION);
  const [resendOtp, { loading: resendLoading, error: resendError }] = useMutation(RESEND_OTP_MUTATION);

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
      // Call the verifyOtp mutation
      verifyOtp({ variables: { input: { phoneNumber, otp } } })
        .then((result) => {
          if (result.data?.verifyOtp.success) {
            // On successful verification, use the AuthContext login function
            auth.login(result.data.verifyOtp.accessToken);
            onComplete(otp); // Still call onComplete if needed for navigation or other local state
          } else {
            // Handle verification failure
            console.error("OTP verification failed:", result.data?.verifyOtp.message);
            // You might want to update isError state or show a specific error message to the user
          }
        })
        .catch((error) => {
          console.error("Error verifying OTP:", error);
        });
    }
  }, [otp, length, phoneNumber, onComplete, verifyOtp, auth]); // Add dependencies

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
              disabled={isDisabled || verifyLoading} // Disable during verification
              className={`
                w-12 h-12 text-2xl rounded-md text-center outline-none border
                ${isError ? "border-error" : "border-gray-300"}
                ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
                focus:border-primary focus:ring-primary
              `}
              style={{ direction: "ltr" }} // Ensure LTR direction for input
            />
          )}
          containerStyle="flex flex-row-reverse justify-between gap-1 md:gap-2 lg:gap-4"
        />
      </div>

      {isError || verifyError && ( // Show error if isError prop is true or mutation failed
        <p className="text-error text-sm">
          {verifyError ? verifyError.message : `کد تایید اشتباه است. تعداد تلاش‌های باقی‌مانده: ${attemptsLeft}`}
        </p>
      )}

      {/* Optional: Show loading state for verification */}
      {verifyLoading && (
        <p className="text-primary text-sm">در حال تایید کد...</p>
      )}

      {/* Optional: Show loading state for resend */}
       {resendLoading && (
        <p className="text-primary text-sm">در حال ارسال مجدد کد...</p>
      )}

      <div className="flex justify-between items-center">
          <p className="text-warning text-sm">
            لطفاً {formatTime(timeLeft)} دیگر دوباره تلاش کنید
          </p>
        ) : (
          <button
            onClick={onResendClick}
            className="text-primary text-sm hover:underline disabled:text-gray-400 disabled:no-underline"
            disabled={timeLeft > 0 || resendLoading} // Disable during countdown or resending
          >
            {timeLeft > 0
              ? `ارسال مجدد کد (${formatTime(timeLeft)})`
              : "ارسال مجدد کد"}
          </button>
       {attemptsLeft === 0 && timeLeft > 0 && (
          <p className="text-warning text-sm">
            لطفاً {formatTime(timeLeft)} دیگر دوباره تلاش کنید
          </p>
        )} {/* Display time left if attempts are zero */}
         {(attemptsLeft > 0 || timeLeft === 0) && !resendLoading && (
          <button onClick={() => resendOtp({ variables: { input: { phoneNumber } } })} className="text-primary text-sm hover:underline disabled:text-gray-400 disabled:no-underline" disabled={timeLeft > 0}> {timeLeft > 0 ? `ارسال مجدد کد (${formatTime(timeLeft)})` : "ارسال مجدد کد"} </button>
        )} {/* Resend button if attempts > 0 or timeLeft is 0 */}
      </div>
    </div>
  );
};
