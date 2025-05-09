import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RunnerCard } from './RunnerCard';
import { RunnerCard as RunnerCardType } from '../../types';
import { useNavigate } from 'react-router-dom';

interface CardsCarouselProps {
  cards: RunnerCardType[];
  onInterestClick?: (cardId: string) => void;
  hasExpressedInterest?: (cardId: string) => boolean;
  isLoading?: boolean;
}

export const CardsCarousel: React.FC<CardsCarouselProps> = ({
  cards,
  onInterestClick,
  hasExpressedInterest = () => false,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (cardId: string) => {
    navigate(`/app/cards/${cardId}`);
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden h-80 bg-gray-50 rounded-lg animate-pulse">
        <div className="flex gap-4 p-4">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-72 h-64 bg-gray-200 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gray-50 rounded-lg p-8 text-center">
        <p>هیچ کارتی یافت نشد</p>
      </div>
    );
  }

  // Duplicate cards for infinite effect
  const duplicatedCards = [...cards, ...cards];

  return (
    <div className="relative overflow-hidden bg-gray-50 rounded-lg">
      <motion.div
        ref={carouselRef}
        className="flex gap-4 p-4"
        animate={{
          x: [0, -cards.length * 304], // 304 = card width (272) + gap (32)
        }}
        transition={{
          x: {
            duration: 20 * cards.length, // Slower for more cards
            ease: "linear",
            repeat: Infinity,
          },
        }}
      >
        {duplicatedCards.map((card, index) => (
          <RunnerCard
            key={`${card.id}-${index}`}
            card={card}
            className="flex-shrink-0 w-72"
            onInterestClick={onInterestClick}
            hasExpressedInterest={hasExpressedInterest(card.id)}
            onClick={handleCardClick}
          />
        ))}
      </motion.div>
    </div>
  );
};