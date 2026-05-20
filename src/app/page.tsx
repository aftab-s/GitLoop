'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Music, Terminal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { NeonButton } from '@/components/ui/NeonButton';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';

export default function Home() {
  const router = useRouter();
  const [inputUsername, setInputUsername] = useState('');
  const { setUsername } = useAppStore();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      setUsername(inputUsername.trim());
      router.push(`/dashboard?username=${encodeURIComponent(inputUsername.trim())}`);
    }
  };

  const sampleProfiles = [
    { username: 'neoncoder' },
    { username: 'zen_dev' },
  ];

  const stats = [
    { value: '100%', label: 'client-side synthesis', sub: 'No server audio rendering. Everything runs in your browser.' },
    { value: 'AI', label: 'generated identity', sub: 'Groq LLM writes your coding archetype and musical lore.' },
    { value: '∞', label: 'unique soundtracks', sub: 'Every GitHub profile produces a completely distinct mix.' },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full relative z-10 overflow-x-hidden">

        {/* ─── Hero ────────────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 pt-[calc(var(--nav-height)+4rem)] pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT — copy + search */}
          <div className="flex flex-col gap-7">

            {/* Eyebrow */}
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent-lime/70 flex items-center gap-2">
              <span className="w-6 h-px bg-accent-lime/40" />
              Procedural GitHub Music
            </span>

            {/* Headline */}
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-white">
                What does<br />
                your <em className="not-italic text-accent-lime font-serif-funky">code</em><br />
                sound like?
              </h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm mt-1">
                Enter your GitHub handle. We map your commits, languages, and activity into a live procedural soundtrack — generated entirely in the browser.
              </p>
            </div>

            {/* Search Input */}
            <div id="generate" className="flex flex-col gap-3 max-w-sm">
              <form onSubmit={handleGenerate} className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted font-mono text-sm pointer-events-none">@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 focus:border-accent-lime/40 text-white placeholder-text-muted/60 focus:outline-none transition-all duration-200 font-mono text-sm"
                    required
                  />
                </div>
                <NeonButton type="submit" variant="primary" className="py-3 px-5 text-sm rounded-xl flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </NeonButton>
              </form>

              {/* Sample links — inline editorial style */}
              <p className="text-[11px] text-text-muted font-mono">
                Try:{' '}
                {sampleProfiles.map((p, i) => (
                  <React.Fragment key={p.username}>
                    <button
                      onClick={() => { setUsername(p.username); router.push(`/dashboard?username=${p.username}`); }}
                      className="text-text-secondary hover:text-accent-lime transition-colors cursor-pointer underline-offset-2 hover:underline"
                    >
                      @{p.username}
                    </button>
                    {i < sampleProfiles.length - 1 && <span className="mx-1.5 text-white/20">·</span>}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>

          {/* RIGHT — Synthesizer illustration in a terminal frame */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Subtle ambient glow behind */}
            <div className="absolute inset-0 bg-accent-violet/5 rounded-3xl blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-lg">
              {/* Window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 bg-white/[0.03] border border-white/8 rounded-t-2xl border-b-0">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="ml-3 text-[10px] font-mono text-text-muted tracking-wider">git-synth.commitfm</span>
              </div>
              {/* Image */}
              <div className="border border-white/8 border-t-0 rounded-b-2xl overflow-hidden bg-[#0e0819] animate-float-subtle">
                <img
                  src="/images/hero_git_synth.png"
                  alt="Whimsical Git Synthesizer"
                  className="w-full h-auto object-cover block"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Stats Strip ─────────────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-[calc(var(--player-height)+3rem)]">
          {/* Divider */}
          <div className="w-full h-px bg-white/5 mb-10" />

          <dl className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-white/5">
            {stats.map((s, idx) => (
              <div key={idx} className="flex flex-col gap-2 md:px-10 first:pl-0 last:pr-0">
                <dt className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-white font-serif-funky tracking-tight">{s.value}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent-lime/70">{s.label}</span>
                </dt>
                <dd className="text-[11px] text-text-muted leading-relaxed">{s.sub}</dd>
              </div>
            ))}
          </dl>

          {/* Feature trio — clean horizontal rule list */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/5 pt-10">
            {[
              { icon: Music, title: 'Procedural Synthesis', body: 'Commits, streaks, and language stats drive synth pads, bass lines, and beats — all generated in real time.' },
              { icon: Sparkles, title: 'Interactive Visualizer', body: 'A live waveform matrix reacts to your music as it plays, shifting with energy and glitch parameters.' },
              { icon: Terminal, title: 'Developer Identity', body: 'An AI-written archetype, aura colour, and coding lore profile unique to your GitHub footprint.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-accent-lime/60 flex-shrink-0" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{title}</h3>
                </div>
                <p className="text-[11px] text-text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <MobileNav />
    </>
  );
}
