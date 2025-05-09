import React, { useState, useEffect } from 'react';
import ReactOtpInput from 'react-otp-input';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  isError?: boolean;
  timeLeft: number;
  attemptsLeft: number;
  onResendClick: () => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onComplete,
  isError = false,
  timeLeft,
  attemptsLeft,
  onResendClick,
}) => {
  const [otp, setOtp] = useState('');
  const isDisabled = timeLeft > 0 && attemptsLeft === 0;

  // Format remaining time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Reset OTP on error
  useEffect(() => {
    if (isError) {
      setOtp('');
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
      <div className={`${isDisabled ? 'opacity-50' : ''}`}>
        <ReactOtpInput
          value={otp}
          onChange={setOtp}
          numInputs={length}
          renderInput={(props) => <input {...props} />}
          containerStyle="flex flex-row-reverse justify-between gap-2"
          inputStyle={{
            width: '3rem',
            height: '3rem',
            fontSize: '1.5rem',
            borderRadius: '0.5rem',
            border: isError ? '1px solid var(--error)' : '1px solid var(--gray-300)',
            backgroundColor: 'white',
            textAlign: 'center',
            outline: 'none',
            direction: 'ltr',
            ...(isDisabled && { cursor: 'not-allowed' }),
          }}
          focusStyle={{
            border: isError ? '1px solid var(--error)' : '2px solid var(--primary)',
            outline: 'none',
          }}
          isDisabled={isDisabled}
        />
      </div>

      {isError && (
        <p className="text-error text-sm">
          کد تایید اشتباه است. تعداد تلاش‌های باقی‌مانده: {attemptsLeft}
        </p>
      )}

      <div className="flex justify-between items-center">
        {attemptsLeft === 0 && timeLeft > 0 ? (
          <p className="text-warning text-sm">
            لطفاً {formatTime(timeLeft)} دیگر دوباره تلاش کنید
          </p>
        ) : (
          <button
            onClick={onResendClick}
            className="text-primary text-sm hover:underline disabled:text-gray-400 disabled:no-underline"
            disabled={timeLeft > 0}
          >
            {timeLeft > 0
              ? `ارسال مجدد کد (${formatTime(timeLeft)})`
              : 'ارسال مجدد کد'}
          </button>
        )}
      </div>
    </div>
  );
};