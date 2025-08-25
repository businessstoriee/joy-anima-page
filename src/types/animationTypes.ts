import { Variants } from "framer-motion";

export const animationTypes: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  },
  slide: {
    hidden: { x: -50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  },
  zoom: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  },
  flip: {
    hidden: { rotateY: 90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1, transition: { duration: 0.6 } },
  },
  bounce: {
    hidden: { y: -30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } },
  },
  rotate: {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1, transition: { duration: 0.6 } },
  },
  pulse: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6, repeat: Infinity, repeatType: "mirror" } },
  },
  shake: {
    hidden: { x: 0 },
    visible: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6 },
    },
  },
  swing: {
    hidden: { rotate: 0 },
    visible: {
      rotate: [0, 15, -10, 5, -5, 0],
      transition: { duration: 0.8 },
    },
  },
  tada: {
    hidden: { scale: 1 },
    visible: {
      scale: [1, 0.9, 1.1, 0.9, 1],
      rotate: [0, -5, 5, -3, 3, 0],
      transition: { duration: 0.8 },
    },
  },

};
