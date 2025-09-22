import React from 'react';
import { motion } from 'framer-motion';

interface HoverAnimationsProps {
  children: React.ReactNode;
  animation?: 'scale' | 'float' | 'glow' | 'rotate' | 'bounce' | 'pulse';
  className?: string;
}

export const HoverAnimations: React.FC<HoverAnimationsProps> = ({
  children,
  animation = 'scale',
  className = ""
}) => {
  const getAnimationProps = () => {
    switch (animation) {
      case 'scale':
        return {
          whileHover: { scale: 1.05 },
          transition: { duration: 0.2 }
        };
      case 'float':
        return {
          whileHover: { y: -5 },
          transition: { duration: 0.3 }
        };
      case 'glow':
        return {
          whileHover: { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            scale: 1.02
          },
          transition: { duration: 0.3 }
        };
      case 'rotate':
        return {
          whileHover: { rotate: 5 },
          transition: { duration: 0.2 }
        };
      case 'bounce':
        return {
          whileHover: { 
            y: [0, -10, 0],
            transition: { duration: 0.6, repeat: Infinity }
          }
        };
      case 'pulse':
        return {
          whileHover: { 
            scale: [1, 1.05, 1],
            transition: { duration: 0.6, repeat: Infinity }
          }
        };
      default:
        return {
          whileHover: { scale: 1.05 },
          transition: { duration: 0.2 }
        };
    }
  };

  return (
    <motion.div
      className={`cursor-pointer ${className}`}
      {...getAnimationProps()}
    >
      {children}
    </motion.div>
  );
};

export default HoverAnimations;