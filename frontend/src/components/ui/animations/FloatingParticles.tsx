"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 10 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-purple-400/30"
          style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
          animate={{
            y: ["0%", "-50%", "0%"],
            x: ["0%", "20%", "0%"],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
