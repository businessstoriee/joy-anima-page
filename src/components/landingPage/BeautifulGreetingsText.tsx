import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedGradientText = ({ text = 'Beautiful Greetings' }) => {
  const [currentPalette, setCurrentPalette] = useState(0);
  
  // 10 vibrant color combinations (3-5 colors each)
  const colorPalettes = [
    // 1. Electric Purple & Pink
    ['#8A2BE2', '#9370DB', '#DA70D6', '#FF00FF', '#EE82EE'],
    
    // 2. Ocean Blues
    ['#0077BE', '#0096FF', '#00BFFF', '#1E90FF', '#87CEFA'],
    
    // 3. Fiery Red & Orange
    ['#FF4500', '#FF6347', '#FF7F50', '#FF8C00', '#FFA500'],
    
    // 4. Tropical Green & Cyan
    ['#00FF7F', '#00FA9A', '#00CED1', '#20B2AA', '#48D1CC'],
    
    // 5. Royal Purple & Blue
    ['#4B0082', '#483D8B', '#6A5ACD', '#7B68EE', '#9400D3'],
    
    // 6. Sunset Orange & Pink
    ['#FF6B6B', '#FF8E53', '#FFB142', '#FF5252', '#FF4081'],
    
    // 7. Emerald Green & Teal
    ['#228B22', '#32CD32', '#00FF00', '#00FF7F', '#00CED1'],
    
    // 8. Magenta & Violet
    ['#FF00FF', '#DA70D6', '#BA55D3', '#9932CC', '#8A2BE2'],
    
    // 9. Gold & Amber
    ['#FFD700', '#FFDC00', '#FFEA00', '#FFA500', '#FF8C00'],
    
    // 10. Electric Blue & Cyan
    ['#00BFFF', '#1E90FF', '#4169E1', '#0000FF', '#4B0082']
  ];

  // Rotate through color palettes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPalette((prev) => (prev + 1) % colorPalettes.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <motion.h1 
        className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent animate-bounce"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colorPalettes[currentPalette].join(', ')})`,
          backgroundSize: '300% 100%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {text}
      </motion.h1>
      
    </div>
  );
};

export default AnimatedGradientText;