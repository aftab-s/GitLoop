'use client';

import React from 'react';
import { Info, Music, Code, AudioLines, Heart } from 'lucide-react';
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
      title: 'Languages → Instruments & synths',
      description: 'Dominant languages determine the sound. Python maps to soft pads, Rust to industrial bass, TypeScript to polished leads.',
    },
    {
      title: 'Active coding hours → Day/Night Mood',
      description: 'Late night coders trigger dark cyberpunk ambience, while morning developers get bright lo-fi tones.',
    },
    {
      title: 'Stars and forks → Complexity & depth',
      description: 'More stars add layered instruments and rich harmonic structures to the mix.',
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full pt-[calc(var(--nav-height)+2rem)] pb-[calc(var(--player-height)+4rem)] px-6 md:px-12 flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col gap-2 text-center md:text-left mt-8">
          <h1 className="text-3xl md:text-4xl font-serif-funky font-bold tracking-tight text-white flex items-center justify-center md:justify-start gap-2.5">
            <Info className="w-8 h-8 text-accent-lime" />
            <span>About CommitFM</span>
          </h1>
          <p className="text-sm text-text-secondary">
            Discover the creative mapping engineering behind procedural audio synthesis.
          </p>
        </div>

        {/* Story Section */}
        <GlassCard className="p-6 md:p-8 border-white/5 flex flex-col gap-4">
          <h2 className="text-xl font-serif-funky font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-accent-lime" />
            <span>The Concept</span>
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            CommitFM was born out of a simple question: <strong className="text-accent-lilac">&ldquo;What does your code sound like?&rdquo;</strong> 
            We spend years writing code, creating patterns, and building architectures. Each developer has their own signature style: nocturnals debugging at 3 AM, systems engineers pushing rust crates, frontenders polishing CSS selectors.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            By analyzing publicly available profile data from the GitHub API, CommitFM maps repositories, codebases, commits, and activity patterns into a unique, responsive audio synthesis soundtrack directly in your browser.
          </p>
        </GlassCard>

        {/* Synthesis mapping */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-serif-funky font-bold text-white flex items-center gap-2">
            <AudioLines className="w-5 h-5 text-accent-lime" />
            <span>Audio Mapping Algorithm</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mappingRules.map((rule, idx) => (
              <GlassCard key={idx} className="p-5 border-white/5">
                <h3 className="text-sm font-bold text-purple-200 mb-2">{rule.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{rule.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <GlassCard className="p-6 border-white/5 flex flex-col gap-4">
          <h2 className="text-xl font-serif-funky font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-accent-lime" />
            <span>Tech Stack Details</span>
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-semibold font-mono">Next.js 15</span>
            <span className="px-3 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300 font-semibold font-mono">Tone.js</span>
            <span className="px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold font-mono">Framer Motion</span>
            <span className="px-3 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold font-mono">Zustand</span>
            <span className="px-3 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-300 font-semibold font-mono">TailwindCSS v4</span>
            <span className="px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-300 font-semibold font-mono">Groq AI</span>
          </div>
        </GlassCard>

        {/* Footer info */}
        <div className="text-center text-xs text-text-muted flex items-center justify-center gap-1.5 mt-4">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>for the developers community.</span>
        </div>

      </main>
      <MobileNav />
    </>
  );
}
