"use client";

import { motion } from "framer-motion";

export function ParallaxCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.05,
      }}
      className="flex flex-col gap-4 rounded-2xl border border-white/5 p-6 md:p-8"
      style={{ background: "rgba(33, 33, 33, 0.98)" }}
    >
      {children}
    </motion.li>
  );
}
