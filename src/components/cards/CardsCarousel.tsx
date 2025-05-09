import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion"; // Import useAnimation
import { RunnerCard } from "./RunnerCard";
import { RunnerCard as RunnerCardType } from "../../types";
import { useNavigate } from "react-router-dom";

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
  const controls = useAnimation(); // Initialize animation controls

  const handleCardClick = (cardId: string) => {
    navigate(`/app/cards/${cardId}`);
  };

  useEffect(() => {
    const startAnimation = () => {
      controls.start({
        x: [cards.length * 304, 0], // 304 = card width (272) + gap (32) - Reversed direction
        transition: {
          x: {
            duration: 20 * cards.length, // Slower for more cards
            ease: "linear",
            repeat: Infinity,
          },
        },
      });
    };

    if (cards.length > 0) {
      startAnimation();
    }

    return () => {
      controls.stop(); // Stop animation on unmount
    };
  }, [cards, controls]); // Add controls to dependency array

  const handleDragStart = () => {
    controls.stop(); // Pause animation on drag start
  };

  const handleDragEnd = () => {
    // Resume the original animation after dragging stops
    controls.start({
      x: [cards.length * 304, 0], // Start from the end of the duplicated cards
      transition: {
        x: {
          duration: 20 * cards.length, // Maintain the original duration
          ease: "linear",
          repeat: Infinity,
        },
      },
    });
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
        className="flex gap-4 p-4 cursor-grab" // Added cursor-grab
        drag="x" // Enable horizontal dragging
        dragElastic={0.2} // Add some elasticity when dragging to the edges
        animate={controls} // Use animation controls
        onDragStart={handleDragStart} // Pause animation on drag start
        onDragEnd={handleDragEnd} // Resume animation on drag end
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
