import { Variants } from 'framer-motion';

export const mediaAnimations: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  zoomOut: {
    hidden: { opacity: 0, scale: 1.2 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -10 },
    visible: { 
      opacity: 1, 
      rotate: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  flip: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { 
      opacity: 1, 
      rotateY: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    },
  },
  bounce: {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 20 } 
    },
  },
  swing: {
    hidden: { opacity: 0, rotate: -15 },
    visible: {
      opacity: 1,
      rotate: [0, 8, -8, 4, -4, 0],
      transition: { duration: 1.2, ease: "easeOut" },
    },
  },
  pulse: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: [1, 1.05, 1], 
      transition: { 
        duration: 2, 
        repeat: Infinity, 
        ease: "easeInOut" 
      } 
    },
  },
  wave: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  spiral: {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0, 
      transition: { duration: 1.2, ease: "easeOut" } 
    },
  },
  glitch: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      x: [0, -2, 2, -2, 2, 0],
      filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },
  float: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: [0, -8, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  typewriter: {
    hidden: { opacity: 0, width: 0 },
    visible: { 
      opacity: 1, 
      width: "auto", 
      transition: { duration: 1.5, ease: "easeOut" } 
    },
  },
};

export const getRandomAnimation = (): string => {
  const animations = Object.keys(mediaAnimations);
  return animations[Math.floor(Math.random() * animations.length)];
};

export const getAnimationsByCategory = () => {
  return {
    entrance: ['fade', 'slideUp', 'slideLeft', 'slideRight', 'zoom', 'bounce'],
    creative: ['rotate', 'flip', 'swing', 'spiral', 'glitch'],
    continuous: ['pulse', 'wave', 'float'],
    special: ['typewriter', 'zoomOut'],
  };
};