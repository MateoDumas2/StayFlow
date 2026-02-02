"use client";

import React from 'react';
import { motion } from 'framer-motion';

export const ReactiveTitle = ({ text }: { text: string }) => {
  return (
    <h1 className="text-3xl font-bold text-ink mb-2 flex flex-wrap gap-2">
      {text.split(" ").map((word, i) => (
        <motion.span
          key={i}
          className="inline-block cursor-default"
          whileHover={{ fontWeight: 900, scale: 1.1, color: "var(--sf-primary)" }}
          transition={{ type: "spring", stiffness: 500, damping: 10 }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};
