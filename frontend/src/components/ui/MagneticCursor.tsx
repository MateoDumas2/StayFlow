"use client";

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MagneticCursor() {
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleLinkHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isLink = target.closest('a') || target.closest('button');
        setIsHoveringLink(!!isLink);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleLinkHover);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleLinkHover);
    };
  }, [cursorX, cursorY]);

  // Only show on non-touch devices (basic check)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    // Check if we are in a browser environment
    if (typeof window !== 'undefined') {
        const checkDevice = () => {
            if (window.matchMedia("(pointer: fine)").matches) {
                setIsDesktop(true);
            }
        };
        checkDevice();
    }
  }, []);

  if (!isDesktop) return null;

  return (
    <>
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                backgroundColor: 'white',
                scale: isHoveringLink ? 1.5 : 1,
            }}
        />
        <style jsx global>{`
            body {
                cursor: none; /* Hide default cursor */
            }
            a, button, input, select, textarea {
                cursor: none; /* Hide default cursor on interactive elements */
            }
        `}</style>
    </>
  );
}
