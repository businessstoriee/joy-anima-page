import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
    >
      <div className="relative max-w-md w-full px-6 py-12 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          className="absolute -top-10 -left-10 text-6xl opacity-10"
        >
          ❌
        </motion.div>
        
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 0.5
          }}
          className="absolute -bottom-8 -right-8 text-7xl opacity-10"
        >
          🚧
        </motion.div>

        <div className="relative z-10 text-center">
          {/* Animated 404 text */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.2
            }}
            className="text-8xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            404
          </motion.h1>

          {/* Error message with typing animation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 mb-8"
          >
            Oops! The page you're looking for doesn't exist.
          </motion.p>

          {/* Animated button */}
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="relative overflow-hidden px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium text-lg shadow-lg"
          >
            {/* Button shine effect */}
            <motion.span
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1 }}
              className="absolute top-0 left-0 w-full h-full bg-white/30 -skew-x-12"
            />
            
            <span className="relative flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              >
                ↩️
              </motion.span>
              Return to Home
            </span>
          </motion.button>
        </div>

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-purple-500/20"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default NotFoundPage;