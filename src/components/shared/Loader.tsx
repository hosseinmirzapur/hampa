import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const circleVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const dotVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`relative ${sizes[size]} ${className}`}>
      {/* Rotating circle */}
      <motion.div
        className="absolute inset-0 border-4 border-t-primary border-r-primary-light border-b-primary-light border-l-primary rounded-full"
        variants={circleVariants}
        animate="animate"
      />
      
      {/* Pulsing dot */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 bg-primary rounded-full"
        variants={dotVariants}
        animate="animate"
      />
    </div>
  );
};