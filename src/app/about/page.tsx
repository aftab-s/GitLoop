'use client';

import React from 'react';
import { Music, Code, AudioLines, Heart } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function About() {
  const mappingRules = [
    {
      title: 'Commits per Day → BPM & Intensity',
      description: 'High commit frequency yields fast, energetic rhythms. Low activity results in quiet, ambient soundscapes.',
    },
    {
      title: 'Languages → Instruments & Synths',
      description: 'Dominant languages determine the sound. Python maps to soft pads, Rust to industrial bass, TypeScript to polished leads.',
    },
    {
      title: 'Active Coding Hours → Day/Night Mood',
      description: 'Late-night coders trigger dark cyberpunk ambience, while morning developers get bright lo-fi tones.',
    },
    {
      title: 'Stars and Forks → Complexity & Depth',
      description: 'More stars add layered instruments and rich harmonic structures to the mix.',
    },
  ];

  const stack = [
    { label: 'Next.js 16', color: 'text-purple-300 border-purple-500/20 bg-purple-500/8' },
    { label: 'Tone.js', color: 'text-blue-300 border-blue-500/20 bg-blue-500/8' },
    { label: 'Framer Motion', color: 'text-cyan-300 border-cyan-500/20 bg-cyan-500/8' },
    { label: 'Zustand', color: 'text-indigo-300 border-indigo-500/20 bg-indigo-500/8' },
    { label: 'Tailwind v4', color: 'text-teal-300 border-teal-500/20 bg-teal-500/8' },
    { label: 'Groq AI', color: 'text-orange-300 border-orange-500/20 bg-orange-500/8' },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full pt-[calc(var(--nav-height)+3rem)] pb-[calc(var(--player-height)+4rem)] px-6 md:px-8 flex flex-col gap-6 relative z-10">

        {/* Page Header */}
        <div className="flex flex-col gap-2 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            About CommitFM
          </h1>
          <p className="text-sm text-text-secondary">
            The creative engineering behind procedural audio synthesis from code.
          </p>
        </div>

        {/* The Concept */}
        <GlassCard variant="subtle" className="p-6 border-white/5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-accent-lime/70" />
            The Concept
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            CommitFM was born out of a simple question:{' '}
            <strong className="text-white font-semibold">&ldquo;What does your code sound like?&rdquo;</strong>{' '}
            We spend years writing code, creating patterns, and building architectures. Each developer has their own signature style — nocturnals debugging at 3 AM, systems engineers pushing Rust crates, frontenders polishing CSS selectors.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            By analyzing publicly available profile data from the GitHub API, CommitFM maps repositories, codebases, commits, and activity patterns into a unique, responsive audio synthesis soundtrack, generated live in your browser.
          </p>
        </GlassCard>

        {/* Audio Mapping Algorithm */}
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <AudioLines className="w-3.5 h-3.5 text-accent-lime/70" />
            Audio Mapping Algorithm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mappingRules.map((rule, idx) => (
              <GlassCard key={idx} variant="subtle" className="p-4 border-white/5">
                <h3 className="text-xs font-semibold text-white mb-1.5">{rule.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{rule.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <GlassCard variant="subtle" className="p-6 border-white/5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-accent-lime/70" />
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s.label}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-medium border ${s.color}`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center text-[11px] text-text-muted flex items-center justify-center gap-1.5 pt-2 pb-4">
          <span>Made with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>for the developer community.</span>
        </div>

      </main>
      <MobileNav />
    </>
  );
}
