import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

interface HamburgerButtonProps {
  onClick: () => void;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ onClick }) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className=" bg-white top-4 left-4 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full backdrop-blur-lg border-2 border-primary/30 bg-background/80 shadow-lg hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300 group"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Menu Icon */}
      <motion.div
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10"
      >
        <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:text-primary/80 transition-colors" />
      </motion.div>

      {/* Text label (hidden on mobile) */}
      <span className="hidden sm:inline-block text-sm font-medium text-foreground relative z-10">
        Menu
      </span>

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/30"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.button>
  );
};

export default HamburgerButton;
