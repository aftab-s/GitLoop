'use client';

import React from 'react';
import { Sliders, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import * as audioEngine from '@/lib/music/engine';

const SLIDER_COLORS: Record<string, string> = {
  energy: '#a3e635',
  ambience: '#60a5fa',
  glitch: '#f87171',
  complexity: '#22d3ee',
  bass: '#818cf8',
  tempo: '#34d399',
};

export function MusicControls() {
  const { musicParams, setMusicParams, isPlaying, aiReasoning } = useAppStore();

  const sliders = [
    { label: 'Energy', key: 'energy' as const, desc: 'Rhythm speed and synth intensity' },
    { label: 'Ambience', key: 'ambience' as const, desc: 'Reverb depth and soundscape density' },
    { label: 'Glitchiness', key: 'glitch' as const, desc: 'Micro-stutters and noise bursts' },
    { label: 'Complexity', key: 'complexity' as const, desc: 'Harmonic layers and instrument count' },
    { label: 'Bass', key: 'bass' as const, desc: 'Sub-bass presence and low-end intensity' },
    { label: 'Tempo Scale', key: 'tempo' as const, desc: 'Global playback rate multiplier' },
  ];

  const handleSliderChange = (key: keyof typeof musicParams, value: number) => {
    setMusicParams({ [key]: value });
    if (isPlaying) {
      audioEngine.play({ ...musicParams, [key]: value }).catch(console.error);
    }
  };

  return (
    <GlassCard variant="subtle" className="p-5 border-white/5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-accent-violet/70" />
          Synthesis Mixer
        </h3>
        <span className="text-[10px] font-mono text-accent-lime/60 border border-accent-lime/15 px-2 py-0.5 rounded-full">
          live
        </span>
      </div>

      {/* Sliders */}
      <div className="flex flex-col gap-4">
        {sliders.map((slider) => {
          const val = typeof musicParams[slider.key] === 'number' ? musicParams[slider.key] as number : 0;
          const color = SLIDER_COLORS[slider.key] ?? '#a3e635';
          const pct = val;

          return (
            <div key={slider.key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-text-secondary" title={slider.desc}>
                  {slider.label}
                </span>
                <span className="font-mono text-text-muted tabular-nums">{val}%</span>
              </div>
              <div className="relative h-1 rounded-full bg-white/[0.06] overflow-hidden">
                {/* Filled track */}
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
                  style={{ width: `${pct}%`, backgroundColor: color + '90' }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI reasoning or static tip */}
      {aiReasoning ? (
        <div className="border-t border-white/5 pt-4 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-accent-lime/60 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI-Directed
          </span>
          <p className="text-[11px] text-text-secondary leading-relaxed italic">
            &ldquo;{aiReasoning}&rdquo;
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-text-muted leading-relaxed border-t border-white/5 pt-4">
          Sliders update the procedural synth in real-time while playing.
        </p>
      )}
    </GlassCard>
  );
}
