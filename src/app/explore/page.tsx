'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Music, Flame, Star, Coffee } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientText } from '@/components/ui/GradientText';
import { NeonButton } from '@/components/ui/NeonButton';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import Starfield from '@/components/effects/Starfield';
import AuroraGradient from '@/components/effects/AuroraGradient';
import FloatingParticles from '@/components/effects/FloatingParticles';

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
      description: 'An aggressive, neon-drenched industrial soundscape mapping rust files and nightly runs.',
    },
    {
      username: 'zen_dev',
      name: 'Maya Lin',
      archetype: 'Open Source Nomad',
      genre: 'ambient',
      metric: '500 Stars',
      metricIcon: Star,
      metricColor: 'text-yellow-400',
      description: 'A calming, organic ambient composition driven by Python APIs and CSS colors.',
    },
    {
      username: 'lofi-dreamer',
      name: 'Kenji Sato',
      archetype: 'Pixel Wizard',
      genre: 'lofi',
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
      <FloatingParticles count={20} />

      <main className="flex-1 max-w-5xl mx-auto w-full pt-[calc(var(--nav-height)+2rem)] pb-[calc(var(--player-height)+4rem)] px-6 md:px-12 flex flex-col gap-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col gap-2 text-center md:text-left mt-8">
          <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white flex items-center justify-center md:justify-start gap-2.5">
            <Compass className="w-8 h-8 text-purple-400" />
            <span>Discover Soundtracks</span>
          </h1>
          <p className="text-sm text-text-secondary">
            Explore curated profiles and find how different coding patterns sound under procedural synthesis.
          </p>
        </div>

        {/* Curator Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curatedSoundtracks.map((track) => {
            const MetricIcon = track.metricIcon;
            return (
              <GlassCard
                key={track.username}
                variant="default"
                hover
                className="p-6 border-white/5 flex flex-col justify-between h-80"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">
                        {track.genre}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">@{track.username}</h3>
                      <span className="text-xs text-text-muted">{track.name}</span>
                    </div>

                    <div className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded bg-white/5 border border-white/5 ${track.metricColor}`}>
                      <MetricIcon className="w-3.5 h-3.5" />
                      <span>{track.metric}</span>
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {track.description}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-text-muted tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/25">
                      {track.archetype}
                    </span>
                  </div>
                  
                  <NeonButton
                    onClick={() => handleSelect(track.username)}
                    variant="secondary"
                    glowColor="purple"
                    className="py-2.5 w-full text-xs font-bold"
                  >
                    <Music className="w-3.5 h-3.5" />
                    <span>Load Matrix</span>
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
