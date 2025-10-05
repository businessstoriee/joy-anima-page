import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    const theme = localStorage.getItem('theme');
    const isDarkMode = theme === 'dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (

    <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>


    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-4 right-4 z-50"
    >
      <div
  className={cn(
    "flex items-center gap-2 sm:gap-3 px-2 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-lg border-2 transition-all duration-[1250ms] ease-[cubic-bezier(0.19,1,0.22,1)] shadow-lg outline outline-1 outline-white/50 outline-offset-0 hover:border-white hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.5),0_0_20px_rgba(255,255,255,0.2)] hover:outline-transparent hover:outline-offset-8 hover:[text-shadow:1px_1px_2px_#427388]",
    isDark
      ? "bg-slate-900/80 border-slate-700 shadow-slate-900/50"
      : "bg-white/80 border-slate-200 shadow-slate-200/50"
  )}
>

  {/* Hover expanding colorful border effect */}
<span className="absolute inset-0 rounded-full border-2 border-transparent opacity-0 group-hover:opacity-100 group-hover:animate-ripple pointer-events-none bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"></span>

        {/* Sun Icon */}
<AnimatePresence mode="wait">
  {!isDark && (
    <motion.div
      key="sun"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Sun
        className="w-6 h-6 text-orange-500 fill-transparent transition-colors duration-300 group-hover:fill-orange-500 hover:animate-spin"
      />
    </motion.div>
  )}
</AnimatePresence>

{/* Moon Icon */}
<AnimatePresence mode="wait">
  {isDark && (
    <motion.div
      key="moon"
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: -180 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Moon
        className="w-6 h-6 text-primary fill-transparent transition-colors duration-300 group-hover:fill-primary hover:animate-spin"
      />
    </motion.div>
  )}
</AnimatePresence>


        {/* Switch */}
        <div className="relative">
          <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
            className="data-[state=checked]:bg-primary"
            aria-label="Toggle theme"
          />
          
          {/* Glow Effect */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={cn(
              "absolute inset-0 rounded-full blur-md -z-10",
              isDark
                ? "bg-primary/30"
                : "bg-orange-500/30"
            )}
          />
        </div>

        {/* Theme Label */}
        <motion.span
          key={isDark ? 'dark' : 'light'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "hidden sm:inline-block text-sm font-medium min-w-[50px]", 
            isDark ? "text-slate-200" : "text-slate-700"
          )}
        >
          {isDark ? 'Dark' : 'Light'}
        </motion.span>

      </div>

      {/* Sparkles Effect on Toggle */}
      <AnimatePresence>
        {isDark && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.random() * 100 - 50,
                  y: Math.random() * 100 - 50,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                }}
                className="absolute inset-0 w-1 h-1 bg-primary rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {!isDark && (
    <>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`light-${i}`}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1,
            delay: i * 0.1,
          }}
          className="absolute inset-0 w-1 h-1 rounded-full bg-orange-400"
          style={{
            left: '50%',
            top: '50%',
          }}
        />
      ))}
    </>
  )}
  
    </motion.div>


    </TooltipTrigger>
    <TooltipContent side="left" className="text-sm">
      {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

  );
};

export default ThemeToggle;
