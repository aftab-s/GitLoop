'use client';

import { useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════
// Animated SVG Waveform Hero
// ═══════════════════════════════════════════════════════════

export default function WaveformHero() {
  const pathRef1 = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const pathRef3 = useRef<SVGPathElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let time = 0;

    function animate() {
      time += 0.02;

      const paths = [
        { ref: pathRef1.current, amp: 30, freq: 0.02, speed: 1, phase: 0 },
        { ref: pathRef2.current, amp: 20, freq: 0.03, speed: 1.5, phase: 2 },
        { ref: pathRef3.current, amp: 15, freq: 0.025, speed: 0.8, phase: 4 },
      ];

      for (const p of paths) {
        if (!p.ref) continue;
        let d = 'M 0 100 ';
        for (let x = 0; x <= 800; x += 4) {
          const y =
            100 +
            Math.sin(x * p.freq + time * p.speed + p.phase) * p.amp +
            Math.sin(x * p.freq * 2 + time * p.speed * 0.7) * (p.amp * 0.3);
          d += `L ${x} ${y} `;
        }
        p.ref.setAttribute('d', d);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden opacity-60">
      <svg
        viewBox="0 0 800 200"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="waveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
          </linearGradient>
          {/* Glow filter */}
          <filter id="waveGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          ref={pathRef1}
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="2"
          filter="url(#waveGlow)"
        />
        <path
          ref={pathRef2}
          fill="none"
          stroke="url(#waveGrad2)"
          strokeWidth="1.5"
          filter="url(#waveGlow)"
        />
        <path
          ref={pathRef3}
          fill="none"
          stroke="url(#waveGrad3)"
          strokeWidth="1"
          filter="url(#waveGlow)"
        />
      </svg>
    </div>
  );
}
