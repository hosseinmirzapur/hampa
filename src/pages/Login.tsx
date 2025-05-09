import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneInput } from '../components/auth/PhoneInput';
import { OtpInput } from '../components/auth/OtpInput';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState(false);
  const navigate = useNavigate();
  const { login, verifyOtp, phoneVerification, resetVerification } = useAuth();

  const handlePhoneSubmit = async (phoneNumber: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const success = await login(phoneNumber);
      
      if (success) {
        setStep('otp');
      } else {
        setError('خطا در ارسال کد تایید. لطفا دوباره تلاش کنید.');
      }
    } catch (error) {
      setError('خطا در ارسال کد تایید. لطفا دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    setIsSubmitting(true);
    setOtpError(false);
    
    try {
      const success = await verifyOtp(otp);
      
      if (success) {
        navigate('/app');
      } else {
        setOtpError(true);
      }
    } catch (error) {
      setOtpError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = () => {
    // In a real application, this would trigger sending a new OTP
    login(phoneVerification.phoneNumber);
  };

  const handleBackToPhone = () => {
    resetVerification();
    setStep('phone');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-primary text-4xl font-bold mb-2">همپا</div>
            <p className="text-gray-600">دوست همراه دویدن</p>
          </div>

          {step === 'phone' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center mb-4">ورود / ثبت‌نام</h2>
              <PhoneInput onSubmit={handlePhoneSubmit} isLoading={isSubmitting} />
              {error && <p className="text-error text-sm text-center">{error}</p>}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center mb-4">کد تایید را وارد کنید</h2>
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
              
              {/* Note: For this MVP, the OTP code is always "123456" */}
              <OtpInput
                onComplete={handleOtpComplete}
                isError={otpError}
                timeLeft={phoneVerification.timeLeft}
                attemptsLeft={phoneVerification.attemptsLeft}
                onResendClick={handleResendOtp}
              />
              
              {otpError && phoneVerification.attemptsLeft > 0 && (
                <p className="text-warning text-sm text-center">
                  کد وارد شده صحیح نیست. لطفا دوباره تلاش کنید.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;