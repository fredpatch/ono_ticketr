"use client";

import { AnimatePresence, motion } from "framer-motion";

interface AnimationWrapperProps {
  children: React.ReactNode;
  keyValue?: string;
  initial?: { opacity: number };
  animate?: { opacity: number };
  transition?: { duration: number; delay: number };
  className?: string;
}

const AnimationWrapper = ({
  children,
  keyValue,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1, delay: 0 },
  className,
}: AnimationWrapperProps) => {
  return (
    <AnimatePresence>
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
