import React, { useState } from 'react';
import { CardsList } from '../components/cards/CardsList';
import { useRunnerCards } from '../hooks/useRunnerCards';
import { SubscriptionModal } from '../components/modals/SubscriptionModal';
import { useAuth } from '../contexts/AuthContext';

const RunnersList: React.FC = () => {
  const { getAllCards, expressInterest, hasExpressedInterest, isLoading } = useRunnerCards();
  const { user, updateUser } = useAuth();
  const [isInterestLoading, setIsInterestLoading] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleInterestClick = async (cardId: string) => {
    setIsInterestLoading(true);
    
    try {
      const success = expressInterest(cardId);
      
      if (success) {
        // Show success feedback
        alert('علاقه‌مندی شما با موفقیت ثبت شد');
      }
    } catch (error) {
      console.error('Error expressing interest:', error);
    } finally {
      setIsInterestLoading(false);
    }
  };

  const handleSubscribe = () => {
    // For this MVP, immediately update subscription status on button click
    if (user) {
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 3); // 3 months subscription
      
      updateUser({
        hasSubscription: true,
        subscriptionExpiryDate: expiryDate.toISOString(),
      });
      
      setShowSubscriptionModal(false);
      
      // Show success message
      alert('اشتراک شما با موفقیت فعال شد!');
    }
  };

  // Check if current user has a subscription
  const hasSubscription = user?.hasSubscription || false;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">لیست دونده‌ها</h1>
        {!hasSubscription && (
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="btn btn-primary btn-sm"
          >
            خرید اشتراک
          </button>
        )}
      </div>
      
      {!isLoading && !hasSubscription && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            شما به عنوان کاربر رایگان، فقط به ۳ کارت آخر دسترسی دارید. برای مشاهده همه کارت‌ها، اشتراک تهیه کنید.
          </p>
        </div>
      )}
      
      <CardsList
        cards={getAllCards()}
        onInterestClick={handleInterestClick}
        hasExpressedInterest={hasExpressedInterest}
        isLoading={isLoading}
        showSubscriptionLock={true}
        onSubscribeClick={() => setShowSubscriptionModal(true)}
      />
      
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
      />
    </div>
  );
};

export default RunnersList;