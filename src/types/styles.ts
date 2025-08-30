

import { Variants } from "framer-motion";

// ✅ Helper type for our variant collection
type AnimationVariants = Record<string, Variants>;

// ✅ All variants are strictly typed
export const animationVariants: AnimationVariants = {
  fadeIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9 },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -30 },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 1.1 },
  },
  rotateIn: {
    initial: { opacity: 0, rotate: -5 },
    animate: {
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, rotate: 5 },
  },
  bounceIn: {
    initial: { opacity: 0, scale: 0.7 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.7 },
  },
  // 🔥 Dynamic stagger animation (type-safe)
  fadeUpStagger: {
    initial: { opacity: 0, y: 40 },
    animate: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
    exit: { opacity: 0, y: 40 },
  },
  // 🌟 New additions for variety
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -40 },
  },
  flipIn: {
    initial: { opacity: 0, rotateY: 90 },
    animate: {
      opacity: 1,
      rotateY: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, rotateY: -90 },
  },
  swingIn: {
    initial: { opacity: 0, rotateZ: -15 },
    animate: {
      opacity: 1,
      rotateZ: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
    exit: { opacity: 0, rotateZ: 15 },
  },
};
