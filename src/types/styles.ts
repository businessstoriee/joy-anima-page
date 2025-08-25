export const frameStyles = {
  classic: "border-8 border-white shadow-2xl rounded-lg bg-white transition-all hover:scale-[1.02] hover:shadow-3xl",
  modern: "border-2 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-1",
  vintage: "bg-amber-50 border-4 border-amber-200 shadow-xl rounded-sm relative before:absolute before:inset-2 before:border-2 before:border-amber-300 before:rounded-sm transition-all hover:brightness-105 hover:scale-[1.01]",
  polaroid: "bg-white p-6 pb-12 shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 rounded-md",
  film: "border-6 border-gray-800 bg-black relative p-2 rounded-sm shadow-2xl before:absolute before:-top-3 before:left-0 before:right-0 before:h-3 before:bg-gray-800 before:rounded-t after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-3 after:bg-gray-800 after:rounded-b",
  elegant: "bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-3xl overflow-hidden border border-yellow-500 transition-all hover:shadow-[0_0_20px_gold]",
  minimal: "border border-gray-200 bg-white shadow-sm rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5",
  artistic: "bg-gradient-to-br from-purple-50 to-pink-50 shadow-2xl rounded-3xl p-4 transition-all hover:scale-[1.02] hover:shadow-purple-200",
  neon: "border-2 border-cyan-400 bg-gray-900 rounded-lg shadow-2xl shadow-cyan-400/50 p-3 overflow-hidden relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-400/20 before:to-purple-400/20 before:animate-pulse before:rounded-lg",
  romantic: "bg-gradient-to-br from-rose-50 to-pink-100 border-2 border-rose-200 rounded-2xl shadow-lg p-3 overflow-hidden relative after:absolute after:top-2 after:right-2 after:content-['❤'] after:text-rose-400 after:animate-pulse",
  starry: "bg-gradient-to-br from-indigo-900 to-purple-900 border border-yellow-400 rounded-lg shadow-2xl p-4 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(255,255,0,0.2)_1px,transparent_1px)] before:bg-[length:20px_20px] before:animate-pulse",
  magical: "bg-gradient-to-br from-violet-100 to-fuchsia-100 border-2 border-violet-300 rounded-3xl shadow-xl p-4 overflow-hidden relative before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(139,92,246,0.2)_2px,transparent_1px)] before:bg-[length:24px_24px] before:animate-bounce",
};




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
