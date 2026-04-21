"use client";

import { useEffect, useState, useRef } from "react";
import { useCursor, CursorStyle } from "@/context/CursorContext";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const { color, style, size } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<{x: number, y: number, id: number}[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    let latestX = 0;
    let latestY = 0;

    const render = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${latestX}px, ${latestY}px, 0)`;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const updateMousePosition = (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      if (!isVisible) setIsVisible(true);

      if (style === "fluid") {
        setTrail(prev => [{ x: e.clientX, y: e.clientY, id: Date.now() }, ...prev].slice(0, 5));
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, a, input, [role='button']")) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible, style]);

  useEffect(() => {
    // ONLY hide real cursor if NOT in default mode
    if (style === "default") {
      document.documentElement.style.cursor = "auto";
      document.getElementById("hide-cursor-global")?.remove();
      return;
    }

    document.documentElement.style.cursor = "none";
    const styleTag = document.createElement("style");
    styleTag.id = "hide-cursor-global";
    styleTag.innerHTML = "* { cursor: none !important; }";
    document.head.appendChild(styleTag);

    return () => {
      document.documentElement.style.cursor = "auto";
      document.getElementById("hide-cursor-global")?.remove();
    };
  }, [style]); // Run when style changes

  if (!isVisible || style === "default") return null;

  const hexCol = {
    primary: "#f59e0b",
    blue: "#3b82f6",
    green: "#22c55e",
    purple: "#a855f7",
    white: "#ffffff",
    black: "#000000",
    red: "#ef4444",
    cyan: "#06b6d4"
  }[color] || "#f59e0b";

  // Unified Scaling Logic
  const baseSize = size || 24;
  const hoverScale = isHovering ? 1.3 : 1;
  const finalSize = baseSize * hoverScale;

  return (
    <>
      <AnimatePresence>
        {style === "fluid" && trail.map((point, i) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
            style={{ 
              backgroundColor: hexCol,
              width: (size/2) - i * 2,
              height: (size/2) - i * 2,
              left: point.x - ((size/4) - i),
              top: point.y - ((size/4) - i),
              filter: "blur(2px)"
            }}
          />
        ))}
      </AnimatePresence>

      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform flex items-center justify-center translate-x-[-50%] translate-y-[-50%]"
        style={{ width: `${baseSize}px`, height: `${baseSize}px`, margin: `-${baseSize/2}px 0 0 -${baseSize/2}px` }}
      >
        <div 
          className="relative flex items-center justify-center transition-all duration-300"
          style={{ transform: isHovering ? "scale(1.2)" : "scale(1)" }}
        >
          {/* SYSTEM MODE - Pristine Standard Arrow */}
          {style === "none" && (
             <svg width={baseSize} height={baseSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3L18 12L4 21V3Z" fill={hexCol} stroke="white" strokeWidth="2.5" strokeLinejoin="miter" />
             </svg>
          )}

          {/* CLASSIC MODE - Modern Needle Pointer */}
          {style === "classic" && (
             <svg width={baseSize} height={baseSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 3.5L18.5 12L5.5 20.5L9.5 12L5.5 3.5Z" fill={hexCol} stroke="white" strokeWidth="2" strokeLinejoin="round" />
             </svg>
          )}

          {style === "ring" && (
            <div className="rounded-full border-2 border-current shadow-sm" style={{ color: hexCol, width: baseSize, height: baseSize }} />
          )}

          {style === "dot" && (
            <div className="rounded-full bg-current shadow-md" style={{ color: hexCol, width: baseSize/2.5, height: baseSize/2.5 }} />
          )}

          {style === "pulse" && (
            <div className="relative">
              <div className="rounded-full bg-current" style={{ color: hexCol, width: baseSize/4, height: baseSize/4 }} />
              <div className="absolute inset-0 rounded-full bg-current animate-ping opacity-40" style={{ color: hexCol, width: baseSize/4, height: baseSize/4 }} />
            </div>
          )}

          {style === "aura" && (
            <div className="relative flex items-center justify-center" style={{ width: baseSize*1.5, height: baseSize*1.5 }}>
              <div className="absolute inset-0 bg-current opacity-30 blur-lg animate-pulse rounded-full" style={{ color: hexCol }} />
              <div className="rounded-full bg-current shadow-sm" style={{ color: hexCol, width: baseSize/5, height: baseSize/5 }} />
              <div className="absolute inset-0 border border-current rounded-full opacity-30 animate-spin-slow" style={{ color: hexCol, borderStyle: "dashed" }} />
            </div>
          )}

          {style === "crosshair" && (
            <div className="flex items-center justify-center" style={{ color: hexCol, width: baseSize*1.2, height: baseSize*1.2 }}>
              <div className="absolute w-[1.5px] h-full bg-current opacity-40" />
              <div className="absolute w-full h-[1.5px] bg-current opacity-40" />
              <div className="border border-current rounded-full" style={{ width: baseSize/3, height: baseSize/3 }} />
            </div>
          )}

          {style === "fluid" && (
             <div className="rounded-full border-2 border-current bg-background shadow-sm" style={{ color: hexCol, width: baseSize/2, height: baseSize/2 }} />
          )}
        </div>
      </div>
    </>
  );
}
