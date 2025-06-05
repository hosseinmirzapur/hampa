import React from "react";
import { Clock, MapPin, Phone, Eye, EyeOff, Heart } from "lucide-react";
import { RunnerCardType } from "../../generated/graphql"; // Use generated type
import { useAuth } from "../../contexts/AuthContext";

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
  className = "",
}) => {
  const { user } = useAuth();
  // Use card.userId as creatorId is not directly available on RunnerCardType
  const isCreator = user?.id === card.userId;

  // Format days: if more than 2 days, show first 2 and +X more
  const formatDays = (days: string[]) => {
    if (days.length <= 2) {
      return days.join("، ");
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

  // Placeholder for creator name and profile picture as they are not directly available
  // from RunnerCardType in the current schema.
  // The backend needs to be updated to include a 'createdBy: UserProfileType' field
  // in RunnerCardType for this information to be properly displayed.
  const creatorNameFallback = "کاربر همپا"; // Generic name
  const creatorInitial = creatorNameFallback.charAt(0);
  const creatorProfilePictureFallback = null; // No picture available

  return (
    <div
      className={`card ${className} cursor-pointer transition-transform hover:-translate-y-1`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="relative w-10 h-10 flex-shrink-0">
            {creatorProfilePictureFallback ? ( // Use fallback
              <img
                src={creatorProfilePictureFallback}
                alt={creatorNameFallback}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 dark:bg-neutral-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                {creatorInitial} {/* Use fallback initial */}
              </div>
            )}
          </div>
          <div className="mr-3">
            <h3 className="font-bold text-lg dark:text-gray-100">{creatorNameFallback}</h3>{" "}
            {/* Use fallback name */}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
            <MapPin size={16} className="ml-1 flex-shrink-0" />
            <span className="text-sm">{card.location}</span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-1">
            <Clock size={16} className="ml-1 flex-shrink-0" />
            <span className="text-sm">
              {formatDays(card.days)} - {card.time}
            </span>
          </div>
          <div className="flex items-center text-gray-700 dark:text-gray-300">
            <Phone size={16} className="ml-1 flex-shrink-0" />
            {card.isPhoneNumberPublic ? (
              <span className="text-sm flex items-center">
                <Eye size={14} className="ml-1 text-primary dark:text-primary-light" />
                {card.phoneNumber}
              </span>
            ) : (
              <span className="text-sm flex items-center text-gray-500 dark:text-gray-400">
                <EyeOff size={14} className="ml-1" /> {/* Icon inherits color */}
                محرمانه
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {/* card.interestedUsers is not available directly */}0 علاقه‌مند{" "}
              {/* Placeholder */}
            </span>
          </div>

          {!isCreator && onInterestClick && (
            <button
              className={`btn ${
                hasExpressedInterest
                  ? "bg-gray-100 text-primary hover:bg-gray-200 dark:bg-neutral-700 dark:text-primary-light dark:hover:bg-neutral-600 cursor-default"
                  : "btn-outline"
              }`}
              onClick={handleInterestClick}
              disabled={hasExpressedInterest}
            >
              <Heart
                size={16}
                className={hasExpressedInterest ? "fill-primary" : ""}
              />
              <span>
                {hasExpressedInterest
                  ? "علاقه‌مند شده‌اید"
                  : "من هم علاقه‌مندم"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
