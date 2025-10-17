import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt logic
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), { stiffness: 100, damping: 10 });
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), { stiffness: 100, damping: 10 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width;
    const yVal = (e.clientY - rect.top) / rect.height;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="
        min-h-screen flex items-center justify-center relative overflow-hidden
        bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100
        dark:from-[#0f0c29] dark:via-[#302b63] dark:to-[#24243e]
      "
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-40"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(255,0,150,0.15), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(0,200,255,0.15), transparent 40%)
          `,
          backgroundSize: "200% 200%",
          zIndex: 0,
        }}
      />

      {/* Floating planet */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 w-28 h-28 opacity-30 dark:opacity-40"
      >
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" className="fill-pink-300 dark:fill-purple-500" />
          <path
            d="M10 50C10 30 90 30 90 50C90 70 10 70 10 50Z"
            className="fill-blue-400/60 dark:fill-fuchsia-300/40"
          />
        </svg>
      </motion.div>

      {/* 🧑‍🚀 Draggable Astronaut */}
      <motion.div
        drag
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 200, bounceDamping: 10 }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-16 right-12 w-24 h-24 cursor-grab active:cursor-grabbing opacity-80 dark:opacity-90 z-10"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="80" r="35" className="fill-gray-200 dark:fill-white/20" />
          <rect
            x="75"
            y="115"
            width="50"
            height="40"
            rx="10"
            className="fill-purple-400/70 dark:fill-fuchsia-500/50"
          />
          <path
            d="M85 155 L85 175 M115 155 L115 175"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            className="dark:stroke-fuchsia-300/80"
          />
        </svg>
      </motion.div>

      {/* Main 404 card */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="
          relative z-10 max-w-md w-full p-10 text-center rounded-3xl
          bg-white/80 dark:bg-black/40 backdrop-blur-2xl shadow-2xl
          border border-white/30 dark:border-fuchsia-500/20 overflow-hidden
        "
      >
        {/* Glowing rotating halo */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-40 blur-3xl"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />

        <motion.h1
          style={{ transform: "translateZ(70px)" }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="
            text-8xl md:text-9xl font-extrabold mb-4
            bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent
            dark:from-fuchsia-400 dark:to-indigo-400
            drop-shadow-[0_0_25px_rgba(217,70,239,0.4)]
          "
        >
          404
        </motion.h1>

        <motion.p
          style={{ transform: "translateZ(40px)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl font-medium mb-8 text-gray-600 dark:text-gray-300"
        >
          You’ve drifted off course, astronaut 🪐<br />
          Let’s help you navigate back home!
        </motion.p>

        {/* Return home button */}
        <motion.button
          whileHover={{
            scale: 1.1,
            rotate: [0, 2, -2, 0],
            boxShadow: "0 0 25px rgba(217,70,239,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="
            relative overflow-hidden px-8 py-3 rounded-full font-semibold text-lg
            bg-gradient-to-r from-purple-600 to-pink-600 text-white
            dark:from-fuchsia-500 dark:to-indigo-500
            shadow-lg hover:shadow-purple-400/40 transition-all
          "
        >
          <motion.span
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full bg-white/20 -skew-x-12"
          />
          <span className="relative flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🚀
            </motion.span>
            Return to Home
          </span>
        </motion.button>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/30 dark:bg-fuchsia-400/30"
            style={{
              width: `${Math.random() * 10 + 6}px`,
              height: `${Math.random() * 10 + 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
