"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

export function MouseParallax({ children, className, depth = 1 }: { children: React.ReactNode, className?: string, depth?: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const x = useTransform(springX, [-0.5, 0.5], [-20 * depth, 20 * depth]);
  const y = useTransform(springY, [-0.5, 0.5], [-20 * depth, 20 * depth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = e.clientX / window.innerWidth - 0.5;
      const yPct = e.clientY / window.innerHeight - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
