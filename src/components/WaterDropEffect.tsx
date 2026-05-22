import React, { useState } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface WaterDropEffectProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  id?: string;
}

export default function WaterDropEffect({ children, className = "", onClick, id }: WaterDropEffectProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Diagonal size of the bounding box to ensure full ripple cover
    const size = Math.max(rect.width, rect.height) * 2.5;
    
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      size,
    };
    
    setRipples((prev) => [...prev, newRipple]);

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div 
      id={id}
      className={`relative overflow-hidden cursor-pointer ${className}`}
      onMouseDown={handlePointerDown}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/20 pointer-events-none animate-water-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            marginLeft: -ripple.size / 2,
            marginTop: -ripple.size / 2,
          }}
          onAnimationEnd={() => {
            setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
          }}
        />
      ))}
    </div>
  );
}
