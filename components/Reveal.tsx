"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import React from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  style?: CSSProperties;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

// "暗闇から静かに浮かび上がる" — cinematic reveal
// No bounce, no float: pure atmospheric emergence
const CINEMATIC = {
  initial: { opacity: 0, y: 7 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
};

export function Reveal({ children, delay = 0, style, className }: RevealProps) {
  return (
    <motion.div
      {...CINEMATIC}
      transition={{
        duration: 1.9,
        ease: [0.16, 1, 0.3, 1],
        delay,
      }}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// For inline/block text reveals
export function RevealText({
  children,
  delay = 0,
  style,
  className,
}: RevealProps) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true, margin: "-30px" }}
      style={{ display: "block", ...style }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

// Gold rule that expands in width
export function RevealRule({ delay = 0, full = false }: { delay?: number; full?: boolean }) {
  return (
    <motion.hr
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: full ? "100%" : 40, opacity: 1 }}
      transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay }}
      viewport={{ once: true }}
      className={full ? "gold-rule-full" : "gold-rule"}
    />
  );
}
