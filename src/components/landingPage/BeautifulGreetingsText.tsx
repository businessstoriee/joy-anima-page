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

   const letters = text.split("");

  return (
    <div className="text-center group hover:animate-pulse">
      <motion.h1 
        className="text-3xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent animate-bounce"
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
        <span className="absolute left-1/2 -translate-x-1/2 -bottom-1 
                 w-0 h-0.5 transition-all duration-300 
                 group-hover:w-2/3"
        style={{
          backgroundImage: `linear-gradient(90deg, ${colorPalettes[currentPalette].join(', ')})`,
          backgroundSize: '300% 100%',
        }}
        ></span>
      </motion.h1>


{/* 
<button className="hover:animate-bounce">Hover Bounce</button>
<button className="hover:animate-pulse">Hover Pulse</button>
<button className="hover:animate-jello">Hover Jello</button>
<button className="hover:animate-heartBeat">Hover HeartBeat</button>
<button className="hover:animate-swing">Hover Swing</button>
<button className="hover:animate-shakeX">Hover Shake X</button>
<button className="hover:animate-shakeY">Hover Shake Y</button>
<button className="hover:animate-flip">Hover Flip</button>
<button className="hover:animate-wobble">Hover Wobble</button>

<button className="active:animate-rubberBand">Click RubberBand</button>
<button className="active:animate-headShake">Click HeadShake</button>
<button className="active:animate-flash">Click Flash</button>
<button className="active:animate-bounceIn">Click BounceIn</button>
<button className="active:animate-fadeIn">Click FadeIn</button>
<button className="active:animate-fadeOut">Click FadeOut</button>
<button className="active:animate-zoomIn">Click ZoomIn</button>
<button className="active:animate-zoomOut">Click ZoomOut</button>
 */}


    </div>
  );
};

export default AnimatedGradientText;