'use client';

import { useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════
// Animated Starfield Background
// ═══════════════════════════════════════════════════════════

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
  color: string;
}

const STAR_COLORS = [
  'rgba(168, 85, 247,',  // purple
  'rgba(59, 130, 246,',  // blue
  'rgba(6, 182, 212,',   // cyan
  'rgba(236, 72, 153,',  // magenta
  'rgba(255, 255, 255,', // white
];

export default function Starfield({ starCount = 200 }: { starCount?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Performance check — reduce stars on mobile
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? Math.floor(starCount / 2) : starCount;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Generate stars
    const stars: Star[] = Array.from({ length: count }, () => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * 1000,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (const star of stars) {
        // Move star toward viewer
        star.z -= star.speed;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = Math.random() * width - cx;
          star.y = Math.random() * height - cy;
        }

        // Project 3D to 2D
        const scale = 300 / star.z;
        const x2d = star.x * scale + cx;
        const y2d = star.y * scale + cy;
        const size = star.size * scale;

        if (x2d < 0 || x2d > width || y2d < 0 || y2d > height) continue;

        const alpha = Math.min(1, (1000 - star.z) / 600) * star.opacity;

        // Draw star with glow
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${alpha})`;
        ctx.fill();

        // Subtle glow
        if (size > 0.8) {
          ctx.beginPath();
          ctx.arc(x2d, y2d, size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `${star.color}${alpha * 0.2})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [starCount]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
