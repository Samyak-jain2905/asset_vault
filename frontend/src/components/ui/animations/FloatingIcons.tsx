"use client";
import { motion } from "framer-motion";
import { Camera, Car, FileText, Laptop, Phone, Receipt, Watch } from "lucide-react";

const icons = [
  { Icon: Laptop, x: "10%", y: "20%", delay: 0, size: 24 },
  { Icon: Camera, x: "85%", y: "15%", delay: 1, size: 32 },
  { Icon: Car, x: "15%", y: "70%", delay: 2, size: 28 },
  { Icon: Watch, x: "80%", y: "80%", delay: 1.5, size: 24 },
  { Icon: Phone, x: "25%", y: "45%", delay: 0.5, size: 20 },
  { Icon: FileText, x: "75%", y: "45%", delay: 2.5, size: 26 },
  { Icon: Receipt, x: "50%", y: "85%", delay: 3, size: 22 },
];

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-400/30"
          style={{ left: item.x, top: item.y }}
          animate={{
            y: ["0px", "-20px", "0px"],
            rotate: [0, 10, -10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 6,
            delay: item.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <item.Icon size={item.size} />
        </motion.div>
      ))}
    </div>
  );
}
