import React from 'react';
import { RunnerCard } from './RunnerCard';
import { RunnerCard as RunnerCardType } from '../../types';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface CardsListProps {
  cards: RunnerCardType[];
  onInterestClick?: (cardId: string) => void;
  hasExpressedInterest?: (cardId: string) => boolean;
  isLoading?: boolean;
  showSubscriptionLock?: boolean;
  onSubscribeClick?: () => void;
}

export const CardsList: React.FC<CardsListProps> = ({
  cards,
  onInterestClick,
  hasExpressedInterest = () => false,
  isLoading = false,
  showSubscriptionLock = false,
  onSubscribeClick,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasSubscription = user?.hasSubscription || false;

  const handleCardClick = (cardId: string, index: number) => {
    // If locked due to subscription and not one of the first 3 cards
    if (showSubscriptionLock && !hasSubscription && index >= 3) {
      if (onSubscribeClick) {
        onSubscribeClick();
      }
      return;
    }
    
    navigate(`/app/cards/${cardId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-xl h-44"></div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">هیچ کارتی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.map((card, index) => {
        const isLocked = showSubscriptionLock && !hasSubscription && index >= 3;
        
        return (
          <div key={card.id} className="relative">
            {isLocked ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gray-300 bg-opacity-70 backdrop-blur-sm z-10 rounded-xl flex flex-col items-center justify-center">
                  <Lock size={32} className="text-gray-700 mb-2" />
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    برای مشاهده، اشتراک تهیه کنید
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={onSubscribeClick}
                  >
                    خرید اشتراک
                  </button>
                </div>
                <RunnerCard
                  card={card}
                  className="filter blur-sm"
                  onClick={() => {}}
                />
              </div>
            ) : (
              <RunnerCard
                card={card}
                onInterestClick={onInterestClick}
                hasExpressedInterest={hasExpressedInterest(card.id)}
                onClick={(cardId) => handleCardClick(cardId, index)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};