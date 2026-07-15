"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Package } from "lucide-react";

export function Preloader() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0f]"
      initial={{ opacity: 1 }}
      animate={{ opacity: loading ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ pointerEvents: loading ? "auto" : "none" }}
    >
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: loading ? [0.8, 1.1, 1] : 15, 
          opacity: loading ? 1 : 0,
          rotateY: loading ? [0, 180, 360] : 0
        }}
        transition={{ 
          duration: loading ? 2.5 : 0.8, 
          ease: "easeInOut",
          rotateY: { repeat: Infinity, duration: 2, ease: "linear" }
        }}
      >
        <Package className="w-16 h-16 text-purple-500 mb-4 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        <h2 className="text-2xl font-bold text-white tracking-widest">AssetVault</h2>
      </motion.div>
    </motion.div>
  );
}
