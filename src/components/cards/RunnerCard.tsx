import React from 'react';
import { Clock, MapPin, Phone, Eye, EyeOff, Heart } from 'lucide-react';
import { RunnerCard as RunnerCardType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface RunnerCardProps {
  card: RunnerCardType;
  onInterestClick?: (cardId: string) => void;
  hasExpressedInterest?: boolean;
  onClick?: (cardId: string) => void;
  className?: string;
}

export const RunnerCard: React.FC<RunnerCardProps> = ({
  card,
  onInterestClick,
  hasExpressedInterest = false,
  onClick,
  className = '',
}) => {
  const { user } = useAuth();
  const isCreator = user?.id === card.creatorId;

  // Format days: if more than 2 days, show first 2 and +X more
  const formatDays = (days: string[]) => {
    if (days.length <= 2) {
      return days.join('، ');
    }
    return `${days[0]}، ${days[1]} و ${days.length - 2} روز دیگر`;
  };

  const handleInterestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onInterestClick && !isCreator && !hasExpressedInterest) {
      onInterestClick(card.id);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`card ${className} cursor-pointer transition-transform hover:-translate-y-1`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            {card.creatorProfilePicture ? (
              <img
                src={card.creatorProfilePicture}
                alt={card.creatorName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {card.creatorName.charAt(0)}
              </div>
            )}
          </div>
          <div className="mr-3">
            <h3 className="font-bold text-lg">{card.creatorName}</h3>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center text-gray-700 mb-1">
            <MapPin size={16} className="ml-1 flex-shrink-0" />
            <span className="text-sm">{card.location}</span>
          </div>
          <div className="flex items-center text-gray-700 mb-1">
            <Clock size={16} className="ml-1 flex-shrink-0" />
            <span className="text-sm">{formatDays(card.days)} - {card.time}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Phone size={16} className="ml-1 flex-shrink-0" />
            {card.isPhoneNumberPublic ? (
              <span className="text-sm flex items-center">
                <Eye size={14} className="ml-1 text-primary" />
                {card.phoneNumber}
              </span>
            ) : (
              <span className="text-sm flex items-center">
                <EyeOff size={14} className="ml-1 text-gray-500" />
                محرمانه
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="text-xs text-gray-500">
              {card.interestedUsers.length} علاقه‌مند
            </span>
          </div>

          {!isCreator && onInterestClick && (
            <button
              className={`btn ${
                hasExpressedInterest
                  ? 'bg-gray-100 text-primary hover:bg-gray-200 cursor-default'
                  : 'btn-outline'
              }`}
              onClick={handleInterestClick}
              disabled={hasExpressedInterest}
            >
              <Heart
                size={16}
                className={hasExpressedInterest ? 'fill-primary' : ''}
              />
              <span>{hasExpressedInterest ? 'علاقه‌مند شده‌اید' : 'من هم علاقه‌مندم'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};