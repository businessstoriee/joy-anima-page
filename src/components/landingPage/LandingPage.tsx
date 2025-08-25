// src/pages/LandingPage.tsx (or src/components/LandingPage.tsx)
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEOManager from '@/components/seo/SEOManager';
import TypingText from '@/components/reusableTypingText/TypingText'
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { useLocation, useNavigate } from 'react-router-dom';


const LandingPage: React.FC = () => {
     const navigate = useNavigate();
  const createNewGreeting = () => {
    // TODO: Replace with your greeting creation logic
     navigate('/create');
  };
    const { translate } = useLanguageTranslation();
    

 return (
   <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4 sm:p-6">
  <SEOManager 
    eventType="greeting"
    isPreview={false}
  />
  
  {/* Main container with max-width and centered content */}
  <div className="max-w-4xl mx-auto">

    {/* Hero section */}
    <div className="relative text-center px-4 sm:px-6 mb-12 sm:mb-16">
      {/* Floating decorative emojis - hidden on mobile */}
   {/* Animated Emoji Background Elements */}
<div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
  {[
    { emoji: '🎈', animation: 'float-x' },
    { emoji: '✨', animation: 'float-y' },
    { emoji: '🌸', animation: 'rotate' },
    { emoji: '🎊', animation: 'bounce-slow' },
    { emoji: '🎨', animation: 'spin-slow' },
    { emoji: '❤️', animation: 'pulse' },
    { emoji: '🎁', animation: 'bounce' },
    { emoji: '🌟', animation: 'twinkle' },
    { emoji: '🎉', animation: 'tada-slow' },
    { emoji: '🌈', animation: 'color-shift' }
  ].map((item, index) => {
    // Generate random positions (0-100% of viewport)
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = 10 + Math.random() * 20;
    const size = 2 + Math.random() * 4; // emoji size multiplier
    
    return (
      <motion.div
        key={index}
        className={`text-3xl md:text-4xl absolute opacity-20 hover:opacity-70 transition-opacity cursor-pointer`}
        style={{
          left: `${posX}%`,
          top: `${posY}%`,
          fontSize: `${size}rem`,
          zIndex: Math.floor(size * 10)
        }}
        animate={{
          y: [0, -20, 0, 20, 0],
          x: [0, 15, 0, -15, 0],
          rotate: [0, 10, -5, 5, 0]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
          delay: delay
        }}
        whileHover={{
          scale: 1.5,
          opacity: 1,
          transition: { duration: 0.3 }
        }}
      >
        {item.emoji}
      </motion.div>
    );
  })}
</div>

      {/* Main hero content */}
      <div className="relative z-10">
        {/* Animated emoji */}
        <div className="relative inline-block">
          <div className="text-6xl sm:text-8xl md:text-9xl mb-4 sm:mb-6 animate-bounce-in hover:animate-tada cursor-pointer">
            🎉
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_70%)] animate-pulse-slow pointer-events-none"></div>
        </div>

        {/* Gradient heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-500 to-secondary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift animate-bounce">
          {translate('Beautiful Greetings')}
        </h1>

        {/* Description */}
        <TypingText
          texts={[
            translate('Create stunning, personalized greeting cards for any occasion.'),
            translate('Share joy, love, and celebration with beautiful animations.'),
            translate('Send your wishes in style with custom messages!') ,
             "Create stunning, personalized greeting cards for any occasion.",   
             "Share joy, love, and celebration with beautiful animations.",     
            "Send your wishes in style with custom messages!"
          ]}
          typingSpeed={40}
          pauseBetweenTexts={2000}
          loop={true}
        />

      </div>

      {/* Primary CTA button */}
      <Button
        onClick={createNewGreeting}
        size="lg"
        className="relative overflow-hidden group px-6 sm:px-12 py-4 sm:py-7 mb-8 sm:mb-12 animate-zoom-in shadow-lg sm:shadow-2xl hover:shadow-primary/30 transition-all duration-500 w-full sm:w-auto"
      >
        <span className="relative z-10 flex items-center justify-center sm:justify-start">
          <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-spin">✨</span>
          <span className="text-sm sm:text-base md:text-lg">
            Surprise Them! Design Your Greeting!
          </span>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
      </Button>
    </div>

    {/* Feature card */}
    <div className="perspective-1000 mb-12 sm:mb-16 px-4 sm:px-0">
      <div className="transform-style-preserve-3d hover:rotate-y-6 hover:rotate-x-2 transition-transform duration-500 ease-out">
        <Card className="mx-auto shadow-lg sm:shadow-2xl animate-slide-in bg-gradient-to-br from-background to-muted/50 border border-muted/30 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3 sm:mr-4">
                <span className="text-xl sm:text-2xl">✨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Amazing Features
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-left">
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '🎂', text: '20+ Event Types' },
                  { icon: '🎨', text: 'Custom Animations' },
                  { icon: '📱', text: 'Fully Responsive' },
                  { icon: '🔗', text: 'Shareable Links' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center group">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3 group-hover:scale-125 transition-transform">{item.icon}</span>
                    <span className="text-base sm:text-lg group-hover:text-primary transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: '🖼️', text: 'Image & Video Support' },
                  { icon: '🎵', text: 'Background Music' },
                  { icon: '💬', text: 'Multiple Messages' },
                  { icon: '🎭', text: 'Event Themes Customization' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center group">
                    <span className="text-xl sm:text-2xl mr-2 sm:mr-3 group-hover:rotate-12 transition-transform">{item.icon}</span>
                    <span className="text-base sm:text-lg group-hover:text-primary transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>


    {/* Secondary CTA button */}
    <div className="text-center px-4 sm:px-0">
      
      <Button
onClick={createNewGreeting}
        size="lg"
        className="px-6 sm:px-12 py-4 sm:py-7 w-full sm:w-auto relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l"
        >
        <span className="relative z-10 flex items-center justify-center sm:justify-start">
          <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-spin">🚀</span>
          <span className="text-sm sm:text-base md:text-lg">
            {translate("Let's Get Started!")}
          </span>
  </span>
  
  {/* Button shine effect */}
  <span className="absolute top-0 left-1/2 w-20 h-full bg-white/30 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>
  
  {/* Border elements */}
  <span className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 rounded-lg 
                  group-hover:rounded-none transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)]" />
  
  {/* Lightning border animation */}
  <span className="absolute inset-0 border-2 border-transparent 
                  group-hover:border-[length:400%_400%] group-hover:bg-[length:400%_400%]
                  group-hover:animate-lightning-rounding" />
</Button>
    </div>

    {/* Floating particles background */}
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-primary/10"
          style={{
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 20 + 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  </div>
</div>
  );

};

export default LandingPage;
