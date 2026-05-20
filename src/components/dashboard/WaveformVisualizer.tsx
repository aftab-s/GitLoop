'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Eye, Disc, BarChart } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import * as audioEngine from '@/lib/music/engine';
import { GlassCard } from '../ui/GlassCard';
import { cn } from '@/lib/utils';

export function WaveformVisualizer() {
  const { isPlaying, identity } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [visMode, setVisMode] = useState<'wave' | 'circle'>('wave');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 180);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 180;
      }
    };
    window.addEventListener('resize', handleResize);

    // Idle sine wave helpers
    let idlePhase = 0;

    function render() {
      if (!ctx || !canvas) return;

      // Clear with clean background
      ctx.fillStyle = 'rgba(12, 7, 20, 0.25)';
      ctx.fillRect(0, 0, width, height);

      const analyser = audioEngine.getAnalyser();

      if (isPlaying && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        if (visMode === 'wave') {
          // Time domain (waveform) - Solid lime green line
          analyser.getByteTimeDomainData(dataArray);

          ctx.lineWidth = 2.5;
          ctx.strokeStyle = '#a3e635';
          ctx.shadowBlur = 0; // Disable glows

          ctx.beginPath();
          const sliceWidth = width / bufferLength;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * height) / 2;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }

            x += sliceWidth;
          }

          ctx.lineTo(width, height / 2);
          ctx.stroke();
        } else {
          // Frequency domain (circular spectrum) - Lilac and lime bars
          analyser.getByteFrequencyData(dataArray);

          const centerX = width / 2;
          const centerY = height / 2;
          const baseRadius = 40;

          ctx.shadowBlur = 0;

          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255.0) * 30;
            const angle = (i / bufferLength) * Math.PI * 2;
            const r = baseRadius + barHeight;

            const x1 = centerX + Math.cos(angle) * baseRadius;
            const y1 = centerY + Math.sin(angle) * baseRadius;
            const x2 = centerX + Math.cos(angle) * r;
            const y2 = centerY + Math.sin(angle) * r;

            ctx.strokeStyle = i % 2 === 0 ? '#a3e635' : '#d6bbfb';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }

          // Center core disc
          ctx.beginPath();
          ctx.arc(centerX, centerY, baseRadius - 2, 0, Math.PI * 2);
          ctx.fillStyle = '#1c0e2d';
          ctx.strokeStyle = 'rgba(255,255,255,0.06)';
          ctx.lineWidth = 1.5;
          ctx.fill();
          ctx.stroke();
        }
      } else {
        // Render beautiful flat idle wave when not playing
        idlePhase += 0.04;
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#d6bbfb';
        ctx.shadowBlur = 0;

        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * 0.015 + idlePhase) * 10 + Math.cos(x * 0.005 - idlePhase) * 5;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, visMode, identity]);

  return (
    <GlassCard className="p-5 border-white/5 relative overflow-hidden flex flex-col gap-4 rounded-3xl">
      {/* Header with Visualizer toggles */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2 font-serif-funky text-base">
          <Eye className="w-4 h-4 text-accent-lime" />
          <span>Real-time Audio Matrix</span>
        </h3>

        <div className="flex gap-1 bg-white/5 border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => setVisMode('wave')}
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer",
              visMode === 'wave' ? 'bg-accent-lime/10 text-accent-lime border border-accent-lime/20' : 'text-text-muted hover:text-text-secondary border border-transparent'
            )}
          >
            <BarChart className="w-3.5 h-3.5" /> Wave
          </button>
          <button
            onClick={() => setVisMode('circle')}
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer",
              visMode === 'circle' ? 'bg-accent-lime/10 text-accent-lime border border-accent-lime/20' : 'text-text-muted hover:text-text-secondary border border-transparent'
            )}
          >
            <Disc className="w-3.5 h-3.5" /> Circle
          </button>
        </div>
      </div>

      <div className="bg-bg-primary/50 border border-white/5 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full block" />
      </div>
    </GlassCard>
  );
}
