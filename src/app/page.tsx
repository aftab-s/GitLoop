'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Music, ArrowRight, Sparkles, Terminal } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
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
    { username: 'neoncoder', archetype: 'Midnight Debugger', tag: 'cyberpunk', color: 'border-accent-lilac/30' },
    { username: 'zen_dev', archetype: 'Open Source Nomad', tag: 'ambient', color: 'border-accent-lime/30' },
  ];

  const features = [
    {
      title: 'Procedural Synthesis',
      description: 'Your repository data becomes synthwave pads, bass lines, and beats generated live in the browser.',
      icon: Music,
    },
    {
      title: 'Interactive Visualizer',
      description: 'Watch your repositories orbit and glow reactively to the rhythm of your code analytics.',
      icon: Sparkles,
    },
    {
      title: 'Developer Identity Card',
      description: 'Unlock your coding archetype, aura description, and a personalized AI-generated musical lore profile.',
      icon: Terminal,
    },
  ];

  return (
    <>
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 pt-[calc(var(--nav-height)+3rem)] pb-[calc(var(--player-height)+4rem)] relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Hero Section */}
        <section className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6 lg:mt-12">
          {/* Left Column: Heading and Info */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-lime/10 border border-accent-lime/20 text-xs font-semibold text-accent-lime w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tune in to your repository</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif-funky font-bold tracking-tight leading-[1.1] text-white">
              What does your <span className="text-accent-lime italic">code</span> sound like?
            </h1>

            <p className="text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
              Convert your commits, languages, and public stats into a custom procedural soundtrack generated live in your browser.
            </p>
          </div>

          {/* Right Column: Search Input */}
          <div className="lg:col-span-5 w-full flex justify-end">
            <GlassCard id="generate" className="p-6 md:p-8 w-full border-white/10 shadow-flat-lime">
              <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                <div className="flex flex-col text-left gap-1.5">
                  <label className="text-xs uppercase font-bold tracking-widest text-text-muted">
                    GitHub Profile Handle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. neoncoder"
                    value={inputUsername}
                    onChange={(e) => setInputUsername(e.target.value)}
                    className="px-4 py-3 rounded-2xl bg-bg-primary/50 border border-white/10 focus:border-accent-lime text-white placeholder-text-muted focus:outline-none transition-colors font-mono text-sm"
                    required
                  />
                </div>

                <NeonButton type="submit" variant="primary" className="py-3 text-sm">
                  <span>Synthesize Soundtrack</span>
                  <ArrowRight className="w-4 h-4" />
                </NeonButton>
              </form>

              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold text-text-muted uppercase tracking-wider">or test samples</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              {/* Sample profiles links */}
              <div className="grid grid-cols-2 gap-3">
                {sampleProfiles.map((profile) => (
                  <button
                    key={profile.username}
                    onClick={() => {
                      setUsername(profile.username);
                      router.push(`/dashboard?username=${profile.username}`);
                    }}
                    className={`glass-subtle p-3 text-left border ${profile.color} hover:bg-white/5 transition-all text-xs flex flex-col gap-1 rounded-xl cursor-pointer`}
                  >
                    <span className="font-bold text-white">@{profile.username}</span>
                    <span className="text-[10px] text-text-muted flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-lime" />
                      {profile.archetype}
                    </span>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Custom Whimsical Machine Illustration Section */}
        <section className="w-full mt-16 md:mt-24 flex flex-col items-center">
          <div className="w-full rounded-[28px] border-2 border-white/10 overflow-hidden bg-[#130b20] p-4 md:p-6 shadow-flat-lilac max-w-4xl animate-float-subtle">
            <img 
              src="/images/hero_git_synth.png" 
              alt="Whimsical Git Synthesizer Processing Commits" 
              className="w-full h-auto object-cover rounded-2xl border border-white/5"
            />
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <GlassCard key={idx} variant="default" hover className="p-6 border-white/5">
                <div className="p-3 rounded-full bg-accent-lime/10 border border-accent-lime/20 text-accent-lime w-fit mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-serif-funky">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
              </GlassCard>
            );
          })}
        </section>

      </main>
      <MobileNav />
    </>
  );
}
