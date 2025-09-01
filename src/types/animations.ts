import { Variants } from "framer-motion";

// ✅ Single source of truth for all animations - consolidating from multiple files
export const animationVariants: Record<string, Variants> = {
  // Basic entrance animations
  fadeIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9 },
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -30 },
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: -40 },
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, x: 40 },
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, scale: 1.1 },
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  zoomOut: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8 },
    hidden: { opacity: 0, scale: 1.2 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -5 },
    animate: { opacity: 1, rotate: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, rotate: 5 },
    hidden: { opacity: 0, rotate: -10 },
    visible: { opacity: 1, rotate: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
    exit: { opacity: 0, scale: 0.7 },
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  },
  flipIn: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, rotateY: -90 },
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0, transition: { duration: 0.8, ease: "easeOut" } },
  },
  swingIn: {
    initial: { opacity: 0, rotateZ: -15 },
    animate: { opacity: 1, rotateZ: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
    exit: { opacity: 0, rotateZ: 15 },
    hidden: { opacity: 0, rotate: -15 },
    visible: {
      opacity: 1,
      rotate: [0, 8, -8, 4, -4, 0],
      transition: { duration: 1.2, ease: "easeOut" },
    },
  },
  // Stagger animation
  fadeUpStagger: {
    initial: { opacity: 0, y: 40 },
    animate: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: 40 },
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
  // Continuous animations
  pulse: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: [1, 1.05, 1], 
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
    },
    exit: { opacity: 0, scale: 0.9 },
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: [1, 1.05, 1], 
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
    },
  },
  wave: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: [0, -10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: 20 },
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: [0, -10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  float: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: 20 },
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: [0, -8, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  },
  // Creative animations
  spiral: {
    initial: { opacity: 0, scale: 0.5, rotate: -180 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.5, rotate: 180 },
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.2, ease: "easeOut" } },
  },
  glitch: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      x: [0, -2, 2, -2, 2, 0],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0 },
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      x: [0, -2, 2, -2, 2, 0],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
      transition: { duration: 0.6, ease: "easeOut" },
    },
  },
  // New creative animations
  orbiting: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      rotate: [0, 360],
      transition: { duration: 8, repeat: Infinity, ease: "linear" },
    },
    exit: { opacity: 0, scale: 0.8 },
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: [0, 360],
      transition: { duration: 8, repeat: Infinity, ease: "linear" },
    },
  },
  magnetic: {
    initial: { opacity: 0, x: -100, y: -100 },
    animate: {
      opacity: 1,
      x: [0, 10, -5, 0],
      y: [0, -5, 10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0, x: -100, y: -100 },
    hidden: { opacity: 0, x: -100, y: -100 },
    visible: {
      opacity: 1,
      x: [0, 10, -5, 0],
      y: [0, -5, 10, 0],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  ripple: {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: 1,
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.5 },
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: [1, 1.1, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },
  vortex: {
    initial: { opacity: 0, scale: 2, rotate: -360 },
    animate: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.5, ease: "easeOut" } },
    exit: { opacity: 0, scale: 2, rotate: 360 },
    hidden: { opacity: 0, scale: 2, rotate: -360 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 1.5, ease: "easeOut" } },
  },
  constellation: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0.7, 1],
      scale: [0.8, 1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0 },
    hidden: { opacity: 0 },
    visible: {
      opacity: [0, 1, 0.7, 1],
      scale: [0.8, 1, 1.05, 1],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
    },
  },
  drifting: {
    initial: { opacity: 0, x: -20, y: -20 },
    animate: {
      opacity: 1,
      x: [0, 15, -10, 0],
      y: [0, -10, 15, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0, x: -20, y: -20 },
    hidden: { opacity: 0, x: -20, y: -20 },
    visible: {
      opacity: 1,
      x: [0, 15, -10, 0],
      y: [0, -10, 15, 0],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
    },
  },
  cascading: {
    initial: { opacity: 0, y: -50, scale: 0.8 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.2 },
    },
    exit: { opacity: 0, y: -50, scale: 0.8 },
    hidden: { opacity: 0, y: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, delay: 0.2 },
    },
  },
  kaleidoscope: {
    initial: { opacity: 0, rotate: -180, scale: 0.5 },
    animate: {
      opacity: 1,
      rotate: [0, 90, 180, 270, 360],
      scale: [1, 1.1, 1],
      transition: { duration: 4, repeat: Infinity, ease: "linear" },
    },
    exit: { opacity: 0, rotate: -180, scale: 0.5 },
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: {
      opacity: 1,
      rotate: [0, 90, 180, 270, 360],
      scale: [1, 1.1, 1],
      transition: { duration: 4, repeat: Infinity, ease: "linear" },
    },
  },
  floating: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
      y: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
      rotate: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0 },
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      x: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
      y: [0, Math.random() * 20 - 10, Math.random() * 20 - 10, 0],
      rotate: [0, Math.random() * 10 - 5, Math.random() * 10 - 5, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  },
  pulsing: {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: [1, 1.1, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
    exit: { opacity: 0, scale: 0.9 },
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: [1, 1.1, 1],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
    },
  },
};

// Animation categories for easier selection
export const getAnimationsByCategory = () => {
  return {
    entrance: ['fadeIn', 'slideUp', 'slideLeft', 'slideRight', 'zoomIn', 'bounceIn', 'cascading'],
    creative: ['rotateIn', 'flipIn', 'swingIn', 'spiral', 'glitch', 'vortex', 'kaleidoscope'],
    continuous: ['pulse', 'wave', 'float', 'orbiting', 'magnetic', 'ripple', 'drifting'],
    special: ['zoomOut', 'constellation', 'floating', 'pulsing', 'fadeUpStagger'],
  };
};

// Get animation variant by key with fallback
export const getAnimation = (animationKey: string, fallback: string = 'fadeIn') => {
  return animationVariants[animationKey as keyof typeof animationVariants] || animationVariants[fallback as keyof typeof animationVariants] || animationVariants.fadeIn;
};

// Get random animation
export const getRandomAnimation = (): string => {
  const animations = Object.keys(animationVariants);
  return animations[Math.floor(Math.random() * animations.length)];
};

// Check if animation exists
export const hasAnimation = (animationKey: string): boolean => {
  return animationKey in animationVariants;
};

// Get animation with speed control
export const getAnimationWithSpeed = (animationKey: string, speed: number = 1, fallback: string = 'fadeIn') => {
  const baseAnimation = getAnimation(animationKey, fallback);
  
  // Create a modified version with speed control
  const modifiedAnimation = { ...baseAnimation };
  
  // Apply speed to all transition durations
  Object.keys(modifiedAnimation).forEach(key => {
    const state = modifiedAnimation[key as keyof typeof modifiedAnimation];
    if (state && typeof state === 'object' && 'transition' in state) {
      const transition = state.transition as any;
      if (transition && typeof transition === 'object') {
        if ('duration' in transition) {
          transition.duration = transition.duration / speed;
        }
        if ('delay' in transition) {
          transition.delay = transition.delay / speed;
        }
      }
    }
  });
  
  return modifiedAnimation;
};

// Animation options for dropdowns
export const animationOptions = Object.keys(animationVariants).map(key => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
}));