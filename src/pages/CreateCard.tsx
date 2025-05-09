import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardForm } from '../components/forms/CardForm';
import { useRunnerCards } from '../hooks/useRunnerCards';
import { DayOfWeek, TimeOfDay } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CreateCard: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { createCard } = useRunnerCards();
  const { user, login, verifyOtp, phoneVerification } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'form' | 'otp-verification'>('form');
  const [formData, setFormData] = useState<{
    name: string;
    location: string;
    days: DayOfWeek[];
    time: TimeOfDay;
    phoneNumber: string;
    isPhoneNumberPublic: boolean;
  } | null>(null);

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
        const card = createCard(name, location, days, time, phoneNumber, isPhoneNumberPublic);
        
        if (card) {
          navigate(`/cards/${card.id}`);
        } else {
          alert('خطا در ایجاد کارت');
        }
      } else {
        // User is either not logged in or using a different phone number
        // Need to verify the phone number with OTP
        await login(phoneNumber);
        setStep('otp-verification');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      alert('خطا در ایجاد کارت');
      setIsCreating(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    if (!formData) return;
    
    try {
      const success = await verifyOtp(otp);
      
      if (success && formData) {
        const card = createCard(
          formData.name,
          formData.location,
          formData.days,
          formData.time,
          formData.phoneNumber,
          formData.isPhoneNumberPublic
        );
        
        if (card) {
          navigate(`/cards/${card.id}`);
        } else {
          alert('خطا در ایجاد کارت');
          setIsCreating(false);
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setIsCreating(false);
    }
  };

  const handleResendOtp = () => {
    if (formData) {
      login(formData.phoneNumber);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">ایجاد کارت جدید</h1>
        
        {step === 'form' ? (
          <CardForm onSubmit={handleFormSubmit} isLoading={isCreating} />
        ) : (
          <div className="space-y-6">
            <p className="text-center">
              برای تایید شماره تلفن، کد تایید را وارد کنید
            </p>
            <div className="flex justify-center">
              {/* OTP input component would go here */}
              <input
                type="text"
                placeholder="کد تایید را وارد کنید"
                className="input text-center"
                maxLength={6}
                onKeyUp={(e) => {
                  if (e.currentTarget.value.length === 6) {
                    handleOtpComplete(e.currentTarget.value);
                  }
                }}
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleResendOtp}
                className="text-primary hover:underline"
              >
                ارسال مجدد کد
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCard;