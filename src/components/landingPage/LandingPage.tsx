// src/pages/LandingPage.tsx (or src/components/LandingPage.tsx)
import React, { useEffect, useRef, useState} from "react";
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SEOManager from '@/components/seo/SEOManager';
import TypingText from '@/components/reusableTypingText/TypingText'
import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { useLocation, useNavigate } from 'react-router-dom';
import BeautifulGreetingsText from './BeautifulGreetingsText'
// import your existing engine wrapper (the file you posted)
import { initTspEngine } from "@/components/greeting/customization/BackgroundCustomizer/engines/tspEngine";
import PublicGreetingsFeed from '@/components/feed/PublicGreetingsFeed';
import ThemeToggle from '@/components/theme/ThemeToggle';

const LandingPage: React.FC = () => {
     const navigate = useNavigate();
  const createNewGreeting = () => {
    // TODO: Replace with your greeting creation logic
     navigate('/create');
  };
  const { translate } = useLanguageTranslation();
    
 // container where tsParticles will be mounted (engine creates its own child div)
  const particlesRootRef = useRef<HTMLDivElement | null>(null);
  // store instance for cleanup
  const instanceRef = useRef<any>(null);

  const [scattered, setScattered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (scattered) {
      // If already scattered, return immediately
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setScattered(false);
    } else {
      // Scatter letters
      setScattered(true);

      // Automatically return after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setScattered(false);
        timeoutRef.current = null;
      }, 3000);
    }
  };

  useEffect(() => {
    // Only run in browser
    if (!particlesRootRef.current) return;
    // Build settings object compatible with your tspEngine init
    const settings = {
      animation: {
        options: {
          // pick one of your presets: constellation | nebula | snow | fireworks
          subtype: "constellation",
          particleColor:  ["#c084fc", "#2e0bf3ff", "#ec0e88ff"], // violet, blue, pink
    
          particleCount: 30,
          links: true,
          size: 3,
        },
      },
      // optional top-level settings your engine reads (intensity/speed)
      animationIntensity: 80,
      animationSpeed: 3,
    };

    let mounted = true;
    (async () => {
      try {
        const result = await initTspEngine(particlesRootRef.current!, settings);
        // engine returns object with destroy and instance
        if (mounted) {
          instanceRef.current = result;
        } else {
          // cleanup if unmounted quickly
          if (result && result.destroy) await result.destroy();
        }
      } catch (err) {
        // ignore engine load errors (CDN might be blocked, etc.)
        // console.warn("particles init failed:", err);
      }
    })();

    return () => {
      mounted = false;
      const cur = instanceRef.current;
      if (cur && typeof cur.destroy === "function") {
        // destroy returned container
        cur.destroy().catch(() => {});
      }
      instanceRef.current = null;
    };
  }, []);


 return (
   <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20 p-4 sm:p-6">
  <SEOManager 
    eventType="greeting"
    isPreview={false}
  />

  {/* Theme Toggle */}
  <ThemeToggle />

 {/* 🌌 Particle Background */}
{/* Particles root (engine will append a child div inside this element) */}
      <div
        ref={particlesRootRef}
        aria-hidden
        className="absolute inset-0 -z-50 pointer-events-none"
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
          <div className="text-4xl sm:text-5xl md:text-6xl mb-4 sm:mb-6 animate-bounce-in hover:animate-tada cursor-pointer">
            🎉 💖 🥳
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_rgba(255,255,255,0)_50%)] animate-pulse-slow pointer-events-none"></div>
        </div>

        {/* Gradient heading */}
        <BeautifulGreetingsText />

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
    <div className="text-center px-4 sm:px-0">
      
      <Button
onClick={createNewGreeting}
        size="lg"
        className="px-6 sm:px-12 py-4 sm:py-7 mb-8 sm:mb-12 w-full sm:w-auto relative overflow-hidden group animate-zoom-in shadow-2xl hover:shadow-primary/30 transition-all duration-500 bg-gradient-to-r from-pink-500 to-violet-500 hover:bg-gradient-to-l"
        >
        <span className="relative z-10 flex items-center justify-center sm:justify-start">
          <span className="mr-2 sm:mr-3 text-xl sm:text-2xl group-hover:animate-spin">🚀</span>
          <span className="px-4 text-sm sm:text-base">
           Surprise Them! Design Your Greeting!
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

    </div>

    {/* Feature card */}
    <div className="perspective-1000 mb-12 sm:mb-16 px-4 sm:px-0">
      <div className="transform-style-preserve-3d hover:rotate-y-6 hover:rotate-x-2 transition-transform duration-500 ease-out">
        <Card className="mx-auto shadow-lg sm:shadow-2xl animate-slide-in bg-gradient-to-br from-background to-muted/50 border border-muted/30 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3 sm:mr-3">
                <span className="text-xl sm:text-2xl hover:animate-spin">✨</span>
              </div>
              <h2  onClick={handleClick} className="cursor-pointer text-2xl sm:text-3xl font-bold bg-clip-text hover:text-primary hover:scale-105 transition-transform duration-500 ease-out">
                {"Amazing .Features".split("").map((char, i) => {
          // Random offset when scattered
          const x = scattered ? Math.floor(Math.random() * 200 - 100) : 0;
          const y = scattered ? Math.floor(Math.random() * 200 - 100) : 0;
          const rotate = scattered ? Math.floor(Math.random() * 60 - 30) : 0;

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
                transition: "all 0.8s ease-in-out",
              }}
              className="hover:scale-125"
            >
              {char}
            </span>
          );
        })}
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


<div className="relative text-center px-4 sm:px-6 mb-12 sm:mb-16">
{/* 🎨 Secondary CTA Button (Polished Glassy Look) */}
<Button
  onClick={createNewGreeting}
  size="lg"
  className="relative group px-6 sm:px-12 py-8 mb-12 w-full sm:w-auto shadow-lg sm:shadow-2xl transition-all duration-500 overflow-hidden rounded-xl backdrop-blur-md"
>
  {/* 🔥 Always Spinning Gradient Border */}
  <span
    className="absolute inset-0 animate-spin-slow rounded-xl"
    style={{
      background: `
        conic-gradient(
          from 0deg,
          #f472b6,
          #c084fc,
          #6366f1,
          #3b82f6,
          #06b6d4,
          #f472b6
        )
      `,
    }}
  ></span>

  {/* Inner Glassy Background */}
  <span className="absolute inset-[3px] rounded-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-md"></span>

  {/* Button Content */}
  <span className="relative z-10 flex items-center justify-center sm:justify-start">
    <span className="mr-2 sm:mr-3 text-xl sm:text-2xl animate-bounce group-hover:animate-spin">✨</span>
    {/* 🌈 Spinning Gradient Text */}
  <span
    className="text-lg font-bold bg-clip-text text-transparent animate-bounce"
    style={{
      background: `
        conic-gradient(
          from 0deg,
          #e14c16ff,
          #da1078ff,
          #f80e0eff,
          #26e311ff,
          #d44406ff,
          #f472b6
        )
      `,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
    }}
  >
      {translate("Let's Get Started!")}
    </span>
  </span>

  {/* Shine Effect */}
  <span className="absolute top-0 left-1/2 w-20 h-full bg-white/40 -skew-x-12 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-700"></span>

  {/* Extra CSS */}
  <style>
    {`
      @keyframes spinSlow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spinSlow 8s linear infinite;
      }

      @keyframes float-slow {
        0%, 100% { transform: translateY(0) translateX(0); }
        50% { transform: translateY(-30px) translateX(20px); }
      }
      .animate-float-slow {
        animation: float-slow 18s ease-in-out infinite;
      }

      @keyframes shine {
        0% { transform: translateX(-150%) skewX(-20deg); opacity: 0.4; }
        50% { opacity: 1; }
        100% { transform: translateX(150%) skewX(-20deg); opacity: 0.4; }
      }
      .group-hover\\:animate-shine:hover {
        animation: shine 1.2s forwards;
      }

      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradientShift 30s ease infinite;
      }
    `}
  </style>
</Button>
</div>



    {/* Public Greetings Feed */}
    <div className="mt-16 mb-12">
      <PublicGreetingsFeed />
    </div>

    
    {/* Floating particles background */}
    <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
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
    {/* </div> */}

    {/* 🌟 Floating Glowing Particles */}
{/* <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none"> */}
  {[...Array(25)].map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full blur-xl opacity-60 animate-float-slow"
      style={{
        width: `${Math.random() * 12 + 8}px`,
        height: `${Math.random() * 12 + 8}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: [
          "rgba(244,114,182,0.6)", // pink
          "rgba(192,132,252,0.6)", // purple
          "rgba(99,102,241,0.6)",  // indigo
          "rgba(56,189,248,0.6)",  // cyan
        ][Math.floor(Math.random() * 4)],
        animationDelay: `${Math.random() * 10}s`,
        animationDuration: `${20 + Math.random() * 20}s`,
      }}
    />
  ))}
</div>

  </div>
</div>
  );

};

export default LandingPage;
