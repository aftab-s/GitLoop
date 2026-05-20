'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Star, Coffee, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import Starfield from '@/components/effects/Starfield';
import AuroraGradient from '@/components/effects/AuroraGradient';

export default function Explore() {
  const router = useRouter();
  const { setUsername } = useAppStore();

  const curatedSoundtracks = [
    {
      username: 'neoncoder',
      name: 'Alex Rivera',
      archetype: 'Midnight Debugger',
      genre: 'cyberpunk',
      metric: '842 Commits',
      metricIcon: Flame,
      metricColor: 'text-red-400',
      description: 'An aggressive, neon-drenched industrial soundscape mapping Rust files and nightly runs.',
    },
    {
      username: 'zen_dev',
      name: 'Maya Lin',
      archetype: 'Open Source Nomad',
      genre: 'ambient',
      metric: '500 Stars',
      metricIcon: Star,
      metricColor: 'text-yellow-400',
      description: 'A calming, organic ambient composition driven by Python APIs and CSS color palettes.',
    },
    {
      username: 'lofi-dreamer',
      name: 'Kenji Sato',
      archetype: 'Pixel Wizard',
      genre: 'lo-fi',
      metric: 'Chill Vibes',
      metricIcon: Coffee,
      metricColor: 'text-orange-400',
      description: 'A cozy, low-fidelity beat structure capturing frontend UI alignment adjustments.',
    },
  ];

  const handleSelect = (username: string) => {
    setUsername(username);
    router.push(`/dashboard?username=${username}`);
  };

  return (
    <>
      <Navbar />
      <Starfield />
      <AuroraGradient />

      <main className="flex-1 max-w-4xl mx-auto w-full pt-[calc(var(--nav-height)+3rem)] pb-[calc(var(--player-height)+4rem)] px-6 md:px-8 flex flex-col gap-6 relative z-10">

        {/* Page Header */}
        <div className="flex flex-col gap-2 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Discover Soundtracks
          </h1>
          <p className="text-sm text-text-secondary">
            Explore curated profiles and find how different coding patterns sound under procedural synthesis.
          </p>
        </div>

        {/* Curator Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {curatedSoundtracks.map((track) => {
            const MetricIcon = track.metricIcon;
            return (
              <GlassCard
                key={track.username}
                variant="subtle"
                className="p-5 border-white/5 hover:border-white/10 flex flex-col justify-between gap-5 transition-all duration-200"
              >
                {/* Top */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-accent-violet/80">
                        {track.genre}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-0.5">@{track.username}</h3>
                      <span className="text-[11px] text-text-muted">{track.name}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-white/[0.04] border border-white/5 ${track.metricColor} flex-shrink-0`}>
                      <MetricIcon className="w-3 h-3" />
                      <span>{track.metric}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted px-2 py-1 rounded-full bg-white/[0.03] border border-white/5 w-fit">
                    {track.archetype}
                  </span>

                  <NeonButton
                    onClick={() => handleSelect(track.username)}
                    variant="secondary"
                    className="py-2 w-full text-xs"
                  >
                    <span>Load Soundtrack</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </NeonButton>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </main>
      <MobileNav />
    </>
  );
}
