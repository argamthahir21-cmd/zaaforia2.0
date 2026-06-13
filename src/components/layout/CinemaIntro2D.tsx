"use client";

import { useEffect, useState } from "react";

interface CinemaIntro2DProps {
  isOpen: boolean;
  onOpenedComplete: () => void;
  isEntered: boolean;
  onEnteredComplete: () => void;
}

export default function CinemaIntro2D({
  isOpen,
  onOpenedComplete,
  isEntered,
  onEnteredComplete,
}: CinemaIntro2DProps) {
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; delay: string; size: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Trigger callback after the SVG drawing animation finishes (2.2s)
      const timer = setTimeout(() => {
        onOpenedComplete();
      }, 2200);

      // Generate random ambient sparkles in the background
      const list = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        delay: `${Math.random() * 2}s`,
        size: `${2 + Math.random() * 3}px`,
      }));
      setSparkles(list);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onOpenedComplete]);

  useEffect(() => {
    if (isEntered) {
      // Trigger callback after zoom-out animation completes (1.2s)
      const timer = setTimeout(() => {
        onEnteredComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isEntered, onEnteredComplete]);

  return (
    <div className="w-full h-full bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden select-none">
      
      {/* Lights & Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,148,95,0.1)_0%,transparent_75%)] pointer-events-none" />
      
      {/* Background Floating Sparkles */}
      {isOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {sparkles.map((sp) => (
            <div
              key={sp.id}
              className="absolute rounded-full bg-[#FAFAF7] opacity-0 animate-fade-pulse shadow-[0_0_6px_#D4B88A]"
              style={{
                left: sp.left,
                top: sp.top,
                width: sp.size,
                height: sp.size,
                animationDelay: sp.delay,
                animationDuration: "3s",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Logo Container */}
      <div className={`relative flex flex-col items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10 ${
        isEntered ? "scale-[3.5] opacity-0 blur-lg" : "scale-100 opacity-100"
      }`}>
        
        {/* Glow behind monogram */}
        <div className={`absolute w-48 h-48 rounded-full bg-[#B8945F]/15 filter blur-2xl transition-all duration-1000 delay-500 pointer-events-none ${
          isOpen ? "opacity-100 scale-110" : "opacity-0 scale-50"
        }`} />

        {/* --- Custom SVG Line Art Logo Drawing --- */}
        {isOpen && (
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg 
              width="220" 
              height="220" 
              viewBox="0 0 240 240" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg" 
              className="drop-shadow-[0_0_15px_rgba(184,148,95,0.4)] animate-logo-drift"
            >
              {/* Outer Circular Frame */}
              <circle
                cx="120"
                cy="120"
                r="90"
                stroke="#B8945F"
                strokeWidth="2.5"
                className="draw-circle"
              />

              {/* Inner Diamond Frame */}
              <path
                d="M 120 42 L 198 120 L 120 198 L 42 120 Z"
                stroke="#D4B88A"
                strokeWidth="1.5"
                className="draw-diamond"
              />

              {/* --- Z-Monogram --- */}
              {/* Top horizontal bar */}
              <line
                x1="82"
                y1="82"
                x2="158"
                y2="82"
                stroke="#D4B88A"
                strokeWidth="6"
                strokeLinecap="round"
                className="draw-top-bar"
              />

              {/* Diagonal connecting bar */}
              <line
                x1="158"
                y1="82"
                x2="82"
                y2="158"
                stroke="#B8945F"
                strokeWidth="6"
                strokeLinecap="round"
                className="draw-diagonal"
              />

              {/* Bottom horizontal bar */}
              <line
                x1="82"
                y1="158"
                x2="158"
                y2="158"
                stroke="#D4B88A"
                strokeWidth="6"
                strokeLinecap="round"
                className="draw-bot-bar"
              />

              {/* Diamond Accents */}
              {/* Top-left gem */}
              <circle
                cx="82"
                cy="82"
                r="4.5"
                fill="#FAFAF7"
                className="scale-gem gem-tl"
              />

              {/* Bottom-right gem */}
              <circle
                cx="158"
                cy="158"
                r="4.5"
                fill="#FAFAF7"
                className="scale-gem gem-br"
              />
            </svg>
          </div>
        )}
      </div>

      <style jsx>{`
        /* Stroke Drawing Animations */
        .draw-circle {
          stroke-dasharray: 566;
          stroke-dashoffset: 566;
          animation: drawStroke 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .draw-diamond {
          stroke-dasharray: 442;
          stroke-dashoffset: 442;
          animation: drawStroke 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.2s;
        }

        .draw-diagonal {
          stroke-dasharray: 108;
          stroke-dashoffset: 108;
          animation: drawStroke 1.0s ease-in-out forwards;
          animation-delay: 0.5s;
        }

        .draw-top-bar {
          stroke-dasharray: 76;
          stroke-dashoffset: 76;
          animation: drawStroke 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.8s;
        }

        .draw-bot-bar {
          stroke-dasharray: 76;
          stroke-dashoffset: 76;
          animation: drawStroke 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 0.8s;
        }

        @keyframes drawStroke {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Accent Gems Animation */
        .scale-gem {
          transform: scale(0);
          transform-box: fill-box;
          transform-origin: center;
          animation: scaleInGem 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 1.1s;
        }

        @keyframes scaleInGem {
          to {
            transform: scale(1);
          }
        }

        /* Logo floating drift */
        @keyframes logoDrift {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(1deg); }
        }
        .animate-logo-drift {
          animation: logoDrift 5s ease-in-out infinite;
          animation-delay: 2.2s; /* Start after draw is complete */
        }

        /* Sparkles fade-pulse */
        @keyframes fadePulse {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        .animate-fade-pulse {
          animation: fadePulse 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
