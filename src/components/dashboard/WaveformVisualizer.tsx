'use client';

import React, { useEffect, useRef, useState } from 'react';
import { BarChart2, Activity, Disc3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import * as audioEngine from '@/lib/music/engine';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '@/lib/utils';

type VisMode = 'bars' | 'wave' | 'circle';

// Color stops for frequency bar gradient (bass → mid → high)
function barColor(index: number, total: number, alpha = 1): string {
  const t = index / total;
  if (t < 0.33) {
    // Bass: violet → purple
    const r = Math.round(139 + (168 - 139) * (t / 0.33));
    const g = Math.round(92  + (85  - 92)  * (t / 0.33));
    const b = Math.round(246 + (247 - 246) * (t / 0.33));
    return `rgba(${r},${g},${b},${alpha})`;
  } else if (t < 0.66) {
    // Mid: purple → lime
    const u = (t - 0.33) / 0.33;
    const r = Math.round(168 + (163 - 168) * u);
    const g = Math.round(85  + (230 - 85)  * u);
    const b = Math.round(247 + (53  - 247) * u);
    return `rgba(${r},${g},${b},${alpha})`;
  } else {
    // High: lime → cyan
    const u = (t - 0.66) / 0.34;
    const r = Math.round(163 + (34  - 163) * u);
    const g = Math.round(230 + (211 - 230) * u);
    const b = Math.round(53  + (238 - 53)  * u);
    return `rgba(${r},${g},${b},${alpha})`;
  }
}

export function WaveformVisualizer() {
  const { isPlaying, identity } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const [visMode, setVisMode] = useState<VisMode>('bars');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rawCtx = canvas.getContext('2d');
    if (!rawCtx) return;
    const ctx: CanvasRenderingContext2D = rawCtx;

    const CANVAS_H = 180;
    let width  = (canvas.width  = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = CANVAS_H);

    const onResize = () => {
      if (canvas?.parentElement) {
        width  = canvas.width  = canvas.parentElement.clientWidth;
        height = canvas.height = CANVAS_H;
      }
    };
    window.addEventListener('resize', onResize);

    let idlePhase  = 0;
    let idleFrame  = 0;

    // Pre-build idle bar heights for a calm pulsing effect
    const IDLE_BARS = 48;
    const idleHeights = Array.from({ length: IDLE_BARS }, (_, i) =>
      0.06 + 0.12 * Math.sin((i / IDLE_BARS) * Math.PI)
    );

    function drawBars(dataArray: Uint8Array, bufferLength: number) {
      const BAR_COUNT = 64;
      const step      = Math.floor(bufferLength / BAR_COUNT);
      const gap       = 2;
      const barW      = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const radius    = Math.min(barW / 2, 3);

      for (let i = 0; i < BAR_COUNT; i++) {
        // Average a slice of bins for each bar
        let sum = 0;
        for (let j = 0; j < step; j++) sum += dataArray[i * step + j];
        const avg = sum / step;

        const barH  = Math.max(3, (avg / 255) * height * 0.9);
        const x     = i * (barW + gap);
        const y     = height - barH;

        ctx.fillStyle = barColor(i, BAR_COUNT);

        // Rounded-top bar
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barW - radius, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
        ctx.lineTo(x + barW, height);
        ctx.lineTo(x, height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Subtle reflection below
        const grad = ctx.createLinearGradient(0, height, 0, height + barH * 0.25);
        grad.addColorStop(0, barColor(i, BAR_COUNT, 0.12));
        grad.addColorStop(1, barColor(i, BAR_COUNT, 0));
        ctx.fillStyle = grad;
        ctx.fillRect(x, height, barW, barH * 0.25);
      }
    }

    function drawIdleBars() {
      idleFrame++;
      const BAR_COUNT = IDLE_BARS;
      const gap       = 3;
      const barW      = (width - gap * (BAR_COUNT - 1)) / BAR_COUNT;
      const radius    = Math.min(barW / 2, 3);

      for (let i = 0; i < BAR_COUNT; i++) {
        const pulse  = Math.sin(idleFrame * 0.025 + i * 0.4) * 0.04;
        const barH   = Math.max(2, (idleHeights[i] + pulse) * height);
        const x      = i * (barW + gap);
        const y      = height - barH;
        const alpha  = 0.25 + 0.1 * Math.sin(idleFrame * 0.02 + i * 0.3);

        ctx.fillStyle = barColor(i, BAR_COUNT, alpha);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barW - radius, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
        ctx.lineTo(x + barW, height);
        ctx.lineTo(x, height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
      }
    }

    function drawWave(dataArray: Uint8Array, bufferLength: number) {
      const sliceW = width / bufferLength;
      let x = 0;

      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0,   '#8b5cf6');
      grad.addColorStop(0.5, '#a3e635');
      grad.addColorStop(1,   '#22d3ee');

      ctx.lineWidth   = 2;
      ctx.strokeStyle = grad;
      ctx.beginPath();

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
        x += sliceW;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Mirror below center
      ctx.globalAlpha = 0.3;
      x = 0;
      ctx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const v  = dataArray[i] / 128.0;
        const y  = height - (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else         ctx.lineTo(x, y);
        x += sliceW;
      }
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawIdleWave() {
      idlePhase += 0.02;
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0,   'rgba(139,92,246,0.3)');
      grad.addColorStop(0.5, 'rgba(163,230,53,0.2)');
      grad.addColorStop(1,   'rgba(34,211,238,0.3)');

      ctx.lineWidth   = 1.5;
      ctx.strokeStyle = grad;
      ctx.beginPath();
      for (let x = 0; x < width; x++) {
        const y = height / 2
          + Math.sin(x * 0.012 + idlePhase) * 10
          + Math.cos(x * 0.005 - idlePhase * 0.7) * 5;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function drawCircle(dataArray: Uint8Array, bufferLength: number) {
      const cx = width / 2;
      const cy = height / 2;
      const baseR = Math.min(width, height) * 0.22;

      for (let i = 0; i < bufferLength; i++) {
        const barH  = (dataArray[i] / 255) * baseR * 0.8;
        const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2;

        const x1 = cx + Math.cos(angle) * baseR;
        const y1 = cy + Math.sin(angle) * baseR;
        const x2 = cx + Math.cos(angle) * (baseR + barH);
        const y2 = cy + Math.sin(angle) * (baseR + barH);

        ctx.strokeStyle = barColor(i, bufferLength, 0.85);
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Center core
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR - 2);
      coreGrad.addColorStop(0, 'rgba(139,92,246,0.15)');
      coreGrad.addColorStop(1, 'rgba(12,7,20,0.9)');
      ctx.beginPath();
      ctx.arc(cx, cy, baseR - 1, 0, Math.PI * 2);
      ctx.fillStyle   = coreGrad;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth   = 1;
      ctx.fill();
      ctx.stroke();
    }

    function drawIdleCircle() {
      idlePhase += 0.015;
      const cx    = width / 2;
      const cy    = height / 2;
      const baseR = Math.min(width, height) * 0.22;
      const SPOKES = 64;

      for (let i = 0; i < SPOKES; i++) {
        const angle  = (i / SPOKES) * Math.PI * 2 - Math.PI / 2;
        const pulse  = Math.sin(idlePhase + i * 0.3) * 0.12 + 0.05;
        const barH   = pulse * baseR;

        ctx.strokeStyle = barColor(i, SPOKES, 0.2);
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * baseR,         cy + Math.sin(angle) * baseR);
        ctx.lineTo(cx + Math.cos(angle) * (baseR + barH), cy + Math.sin(angle) * (baseR + barH));
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, baseR - 1, 0, Math.PI * 2);
      ctx.fillStyle   = 'rgba(12,7,20,0.7)';
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth   = 1;
      ctx.fill();
      ctx.stroke();
    }

    function render() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      const analyser = audioEngine.getAnalyser();

      if (isPlaying && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray    = new Uint8Array(bufferLength);

        if (visMode === 'bars') {
          analyser.getByteFrequencyData(dataArray);
          drawBars(dataArray, bufferLength);
        } else if (visMode === 'wave') {
          analyser.getByteTimeDomainData(dataArray);
          drawWave(dataArray, bufferLength);
        } else {
          analyser.getByteFrequencyData(dataArray);
          drawCircle(dataArray, bufferLength);
        }
      } else {
        if (visMode === 'bars')   drawIdleBars();
        else if (visMode === 'wave') drawIdleWave();
        else drawIdleCircle();
      }

      animRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [isPlaying, visMode, identity]);

  const modes: { key: VisMode; icon: React.ReactNode; label: string }[] = [
    { key: 'bars',   icon: <BarChart2 className="w-3 h-3" />,  label: 'Spectrum' },
    { key: 'wave',   icon: <Activity  className="w-3 h-3" />,  label: 'Wave'     },
    { key: 'circle', icon: <Disc3     className="w-3 h-3" />,  label: 'Orbit'    },
  ];

  return (
    <GlassCard variant="subtle" className="p-4 border-white/5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-1.5 h-1.5 rounded-full transition-colors',
            isPlaying ? 'bg-accent-lime animate-pulse' : 'bg-white/20'
          )} />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Audio Matrix
          </h3>
          {isPlaying && (
            <span className="text-[9px] font-mono text-accent-lime/60 border border-accent-lime/15 px-1.5 py-0.5 rounded-full">
              live
            </span>
          )}
        </div>

        {/* Mode toggle */}
        <div className="flex gap-0.5 p-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          {modes.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setVisMode(key)}
              className={cn(
                'px-2.5 py-1 rounded-md text-[10px] font-medium flex items-center gap-1 transition-all duration-150 cursor-pointer',
                visMode === key
                  ? 'bg-white/10 text-white'
                  : 'text-text-muted hover:text-text-secondary'
              )}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="rounded-xl overflow-hidden bg-black/30 border border-white/[0.03]">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      {/* Frequency legend for bars mode */}
      {visMode === 'bars' && (
        <div className="flex items-center justify-between text-[9px] text-text-muted font-mono px-0.5">
          <span className="text-accent-violet/60">Bass</span>
          <span className="text-text-muted/40">·····</span>
          <span className="text-accent-lime/60">Mids</span>
          <span className="text-text-muted/40">·····</span>
          <span className="text-cyan-400/60">Highs</span>
        </div>
      )}
    </GlassCard>
  );
}
