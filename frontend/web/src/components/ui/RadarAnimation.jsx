"use client";
import React from "react";

export function Radar({ size = 520, sweepDuration = 4 }) {
    const radius = size / 2;

    const blips = [
        { angle: 35, r: 0.72, delay: 0 },
        { angle: 120, r: 0.45, delay: 0.6 },
        { angle: 210, r: 0.6, delay: 1.1 },
        { angle: 285, r: 0.35, delay: 1.6 },
        { angle: 320, r: 0.85, delay: 2.2 },
    ];

    return (
        <div
            className="relative"
            style={{ width: size + "px", height: size + "px" }}
            aria-hidden
        >
            {[1, 2, 3, 4].map((step) => {
                const diameter = (size * step) / 4;
                return (
                    <div
                        key={step}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                            width: diameter + "px",
                            height: diameter + "px",
                            left: `calc(50% - ${diameter / 2}px)`,
                            top: `calc(50% - ${diameter / 2}px)`,
                            border: "1px solid rgba(70,89,2,0.18)",
                            boxShadow: "inset 0 0 40px rgba(70,89,2,0.02)",
                        }}
                    />
                );
            })}

            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: "8px",
                    height: "8px",
                    left: `calc(50% - 4px)`,
                    top: `calc(50% - 4px)`,
                    background: "#99BF0F",
                    boxShadow: "0 0 8px rgba(70,89,2,0.9)",
                }}
            />

            <div
                className="absolute pointer-events-none"
                style={{
                    left: "50%",
                    top: "50%",
                    width: "1px",
                    height: size + "px",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(180deg, rgba(153,191,15,0.08), transparent)",
                    mixBlendMode: "screen",
                }}
            />
            <div
                className="absolute pointer-events-none"
                style={{
                    top: "50%",
                    left: "50%",
                    height: "1px",
                    width: size + "px",
                    transform: "translateY(-50%)",
                    background: "linear-gradient(90deg, rgba(153,191,15,0.08), transparent)",
                    mixBlendMode: "screen",
                }}
            />

            <div
                className="radar-sweep pointer-events-none absolute inset-0 rounded-full"
                style={{
                    animationDuration: `${sweepDuration}s`,
                }}
            />

            <div className="absolute inset-0 rounded-full pointer-events-none subtle-rotate" />

            {blips.map((b, i) => {
                const angleRad = (b.angle * Math.PI) / 180;
                const dist = radius * b.r;
                const x = radius + Math.cos(angleRad) * dist - 6;
                const y = radius + Math.sin(angleRad) * dist - 6;
                return (
                    <div
                        key={i}
                        className="blip"
                        style={{
                            left: x + "px",
                            top: y + "px",
                            animationDelay: `${b.delay}s`,
                        }}
                    />
                );
            })}

            <style>{`
        .radar-sweep {
          background: conic-gradient(
            from 0deg,
            rgba(153,191,15,0.22) 0deg,
            rgba(153,191,15,0.08) 30deg,
            rgba(153,191,15,0.00) 70deg
          );
          filter: blur(1px);
          transform-origin: 50% 50%;
          mix-blend-mode: screen;
          animation-name: radar-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        @keyframes radar-spin {
          to { transform: rotate(360deg); }
        }

        .subtle-rotate {
          background: radial-gradient(circle at 50% 50%, rgba(153,191,15,0.03), transparent 40%);
          mix-blend-mode: screen;
          filter: blur(6px);
          animation: slow-rotate 30s linear infinite;
        }

        @keyframes slow-rotate {
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }

        .blip {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #738C16;
          box-shadow: 0 0 10px #99BF0F;
          transform-origin: center;
          animation: blip-flash 3s infinite;
        }

        .blip::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          transform: translate(-50%, -50%);
          background: #99BF0F;
          animation: blip-pulse 1.6s ease-out infinite;
        }

        @keyframes blip-pulse {
          0% { transform: translate(-50%, -50%) scale(0.6); opacity: 0.9 }
          70% { transform: translate(-50%, -50%) scale(2.2); opacity: 0 }
          100% { opacity: 0 }
        }

        @keyframes blip-flash {
          0% { transform: scale(0.85); opacity: 0 }
          6% { transform: scale(1); opacity: 1 }
          30% { opacity: 0.6 }
          100% { opacity: 0 }
        }

        @media (prefers-reduced-motion: reduce) {
          .radar-sweep, .subtle-rotate, .blip, .blip::after { animation: none !important; }
        }
      `}</style>
        </div>
    );
}
