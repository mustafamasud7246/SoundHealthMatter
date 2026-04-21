"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type CursorStyle = "ring" | "dot" | "pulse" | "aura" | "fluid" | "crosshair" | "classic" | "none" | "default";
export type CursorColor = "primary" | "blue" | "green" | "purple" | "white" | "black" | "red" | "cyan";

interface CursorContextType {
  style: CursorStyle;
  color: CursorColor;
  size: number;
  setStyle: (s: CursorStyle) => void;
  setColor: (c: CursorColor) => void;
  setSize: (size: number) => void;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyle] = useState<CursorStyle>("ring");
  const [color, setColor] = useState<CursorColor>("primary");
  const [size, setSize] = useState<number>(24);

  useEffect(() => {
    const s = localStorage.getItem("cursorStyle");
    const c = localStorage.getItem("cursorColor");
    const sz = localStorage.getItem("cursorSize");
    if (s) setStyle(s as CursorStyle);
    if (c) setColor(c as CursorColor);
    if (sz) setSize(parseInt(sz));
  }, []);

  const handleSetStyle = (s: CursorStyle) => {
    setStyle(s);
    localStorage.setItem("cursorStyle", s);
  };

  const handleSetColor = (c: CursorColor) => {
    setColor(c);
    localStorage.setItem("cursorColor", c);
  };

  const handleSetSize = (sz: number) => {
    setSize(sz);
    localStorage.setItem("cursorSize", sz.toString());
  };

  return (
    <CursorContext.Provider value={{ 
      style, 
      color, 
      size, 
      setStyle: handleSetStyle, 
      setColor: handleSetColor,
      setSize: handleSetSize
    }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (!context) throw new Error("useCursor must be used within a CursorProvider");
  return context;
}
