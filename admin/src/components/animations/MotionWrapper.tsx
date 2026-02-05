import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Fade in from left
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Fade in from right
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Scale up
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Stagger faster
export const staggerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Float animation
export const floatAnimation: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse glow
export const pulseGlow: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

interface MotionWrapperProps {
  children: ReactNode;
  variant?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleUp";
  delay?: number;
  className?: string;
}

const variants = {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleUp
};

export function MotionWrapper({ 
  children, 
  variant = "fadeInUp", 
  delay = 0,
  className = "" 
}: MotionWrapperProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants[variant]}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionContainer({ 
  children, 
  fast = false,
  className = "" 
}: { 
  children: ReactNode; 
  fast?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fast ? staggerFast : staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  );
}
