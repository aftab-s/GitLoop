'use client';

import React from 'react';
import { Sliders, HelpCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import * as audioEngine from '@/lib/music/engine';

export function MusicControls() {
  const { musicParams, setMusicParams, isPlaying } = useAppStore();

  const sliders = [
    { label: 'Energy', key: 'energy' as const, color: 'accent-purple-500', desc: 'Rhythm speed and synthesizer intensity' },
    { label: 'Ambience', key: 'ambience' as const, color: 'accent-blue-500', desc: 'Soundscape density and reverb depth' },
    { label: 'Glitchiness', key: 'glitch' as const, color: 'accent-red-500', desc: 'Micro-rhythms, stutters, and sound effects' },
    { label: 'Complexity', key: 'complexity' as const, color: 'accent-cyan-500', desc: 'Harmonic layers and instrument diversity' },
    { label: 'Bass', key: 'bass' as const, color: 'accent-indigo-500', desc: 'Sub-bass presence and low-end intensity' },
    { label: 'Tempo Scale', key: 'tempo' as const, color: 'accent-teal-500', desc: 'Global playback rate multiplier' },
  ];

  const handleSliderChange = (key: keyof typeof musicParams, value: number) => {
    setMusicParams({ [key]: value });
    
    // Live update engine if playing
    if (isPlaying) {
      // Re-trigger play with updated parameters to adjust live synthesis attributes
      audioEngine.play({
        ...musicParams,
        [key]: value,
      }).catch(console.error);
    }
  };

  return (
    <GlassCard className="p-5 border-white/5 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-sm font-semibold tracking-tight text-purple-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Synthesis Mixer</span>
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
          Live Mod
        </span>
      </div>

      <div className="flex flex-col gap-5">
        {sliders.map((slider) => {
          const val = musicParams[slider.key];
          return (
            <div key={slider.key} className="flex flex-col gap-1.5 group">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-text-primary group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  {slider.label}
                  <span className="text-[10px] text-text-muted cursor-help" title={slider.desc}>
                    <HelpCircle className="w-3 h-3" />
                  </span>
                </span>
                <span className="font-mono text-text-muted">{typeof val === 'number' ? val : 0}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={typeof val === 'number' ? val : 0}
                onChange={(e) => handleSliderChange(slider.key, Number(e.target.value))}
                className={`w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/5 hover:bg-white/10 transition-colors ${slider.color}`}
              />
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-text-muted leading-relaxed mt-2 p-3 rounded bg-white/5 border border-white/5">
        ⚡ <strong>Pro Tip:</strong> Adjusting these sliders updates the procedural audio synth parameters in real-time. High Glitchiness adds random noise bursts, while High Energy increases note count.
      </div>
    </GlassCard>
  );
}
