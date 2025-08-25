import React, { useMemo } from "react";
import { GreetingFormData } from "@/types/greeting";
import BackgroundRenderer from "@/components/greeting/customization/BackgroundCustomizer/BackgroundRenderer";
import { useReducedMotion, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { animationTypes } from "@/types/animationTypes";

interface Props {
  greetingData: GreetingFormData;
  className?: string;
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<Props> = ({ greetingData, className, children }) => {
  const prefersReducedMotion = useReducedMotion();

  const bgSettings = useMemo(() => {
    const s = greetingData?.backgroundSettings;
    if (!s) return s;
    if (prefersReducedMotion) {
      return { ...s, animation: { ...s.animation, enabled: false } };
    }
    return s;
  }, [greetingData?.backgroundSettings, prefersReducedMotion]);

  const animation = greetingData?.animationStyle || "fade";

  return (
    <BackgroundRenderer
      settings={bgSettings}
      className={cn("p-4 w-full relative overflow-hidden", className)}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={animationTypes[animation]}
      >
        {children}
      </motion.div>
    </BackgroundRenderer>
  );
};

export default BackgroundWrapper;
