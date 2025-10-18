import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Shield, HelpCircle, Headphones, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface AnimatedSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { title: 'Home', path: '/', icon: Home },
  { title: 'About Us', path: '/about', icon: Info },
  { title: 'Privacy Policy', path: '/privacy', icon: Shield },
  { title: 'FAQ', path: '/faq', icon: HelpCircle },
  { title: 'Support', path: '/support', icon: Headphones },
];

const AnimatedSidebar: React.FC<AnimatedSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-br from-background via-background/95 to-primary/5 backdrop-blur-xl border-r border-primary/20 shadow-2xl z-50 overflow-hidden"
          >
            {/* Decorative gradient orbs */}
            <div className="absolute top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 -right-10 w-32 h-32 bg-secondary/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Header */}
            <div className="relative p-6 border-b border-primary/10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    //animate={{ rotate: 360 }}
                    //transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="text-3xl animate-bounce"
                  >
                    💖
                  </motion.div>
                  <h2 className="text-2xl font-bold bg-primary bg-clip-text text-transparent">
                    Menu
                  </h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-primary/10 transition-colors"
                >
                  <X className="w-6 h-6 text-foreground" />
                </motion.button>
              </motion.div>
            </div>

            {/* Navigation Items */}
            <nav className="relative p-4 space-y-2">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                  >
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        'relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden',
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-lg shadow-primary/20'
                          : 'hover:bg-muted/50 text-foreground/80 hover:text-foreground'
                      )}
                    >
                      {/* Animated background on hover */}
                      {hoveredIndex === index && !isActive && (
                        <motion.div
                          layoutId="sidebar-hover"
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      {/* Icon with animation */}
                      <motion.div
                        animate={{
                          rotate: hoveredIndex === index ? [0, -10, 10, -10, 0] : 0,
                        }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10"
                      >
                        <Icon className={cn(
                          'w-5 h-5 transition-colors',
                          isActive ? 'text-primary' : 'text-foreground/60 group-hover:text-primary'
                        )} />
                      </motion.div>

                      {/* Text */}
                      <span className={cn(
                        'relative z-10 font-medium transition-all',
                        isActive && 'font-bold'
                      )}>
                        {item.title}
                      </span>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active"
                          className="absolute right-2 w-2 h-2 rounded-full bg-primary"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}

                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: hoveredIndex === index ? '100%' : '-100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary/10 bg-gradient-to-t from-background/50 to-transparent backdrop-blur-sm"
            >
              <p className="text-sm text-muted-foreground text-center">
                Made with{' '}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block text-red-500"
                >
                  ❤️
                </motion.span>
                {' '}for you
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimatedSidebar;
