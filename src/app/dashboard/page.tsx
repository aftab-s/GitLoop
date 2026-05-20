'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { fetchDeveloperStats } from '@/lib/github';
import { getMockDeveloperStats } from '@/lib/mock-data';
import { generateIdentity } from '@/lib/music/mappings';
import { DeveloperCard } from '@/components/dashboard/DeveloperCard';
import { GitHubStats } from '@/components/dashboard/GitHubStats';
import { MusicControls } from '@/components/dashboard/MusicControls';
import { WaveformVisualizer } from '@/components/dashboard/WaveformVisualizer';
import { NeonButton } from '@/components/ui/NeonButton';
import { Navbar } from '@/components/layout/Navbar';
import { MobileNav } from '@/components/layout/MobileNav';
import { SoundtrackPlayer } from '@/components/player/SoundtrackPlayer';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    stats,
    setStats,
    identity,
    setIdentity,
    isLoading,
    setIsLoading,
    error,
    setError,
    reset,
  } = useAppStore();

  const [aiLoading, setAiLoading] = useState(false);

  const queryUsername = searchParams.get('username');

  // Fetch AI insights from Groq
  const fetchAiInsights = async (statsData: any, defaultIdentity: any) => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: statsData,
          archetype: defaultIdentity.archetype,
        }),
      });

      if (res.ok) {
        const aiData = await res.json();
        setIdentity({
          ...defaultIdentity,
          lore: aiData.lore || defaultIdentity.lore,
          aura: aiData.aura || defaultIdentity.aura,
          mood: aiData.mood || defaultIdentity.mood,
        });
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (queryUsername) {
      const loadProfile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // Attempt real fetch, fall back to mock if fails
          let data;
          try {
            data = await fetchDeveloperStats(queryUsername);
          } catch (err: any) {
            console.warn('Real GitHub fetch failed, falling back to mock:', err.message);
            data = getMockDeveloperStats(queryUsername);
          }

          setStats(data);
          const initialIdentity = generateIdentity(data);
          setIdentity(initialIdentity);

          // Trigger AI insights load
          await fetchAiInsights(data, initialIdentity);
        } catch (err: any) {
          setError(err.message || 'Failed to load profile.');
        } finally {
          setIsLoading(false);
        }
      };

      loadProfile();
    }
  }, [queryUsername]);

  const handleBack = () => {
    reset();
    router.push('/');
  };

  const handleRegenerate = () => {
    if (queryUsername) {
      router.push(`/dashboard?username=${queryUsername}&ref=${Date.now()}`);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden select-none">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full border-t-2 border-accent-lime animate-spin" />
          <h2 className="text-xl font-serif-funky font-bold text-accent-lilac tracking-wide animate-pulse">
            Analyzing repository wavelengths...
          </h2>
          <p className="text-xs text-text-muted">Procedurally synthesizing code matrices</p>
        </div>
      </main>
    );
  }

  if (error || (!stats && !queryUsername)) {
    return (
      <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden p-6">
        <div className="glass max-w-md w-full p-6 text-center border-red-500/20 flex flex-col items-center gap-4 relative z-10">
          <AlertTriangle className="w-12 h-12 text-red-400" />
          <h2 className="text-lg font-bold text-red-200">Something went wrong</h2>
          <p className="text-sm text-text-secondary">
            {error || 'No developer profile active. Please start from the homepage.'}
          </p>
          <NeonButton onClick={handleBack} variant="primary">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </NeonButton>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full pt-[calc(var(--nav-height)+2rem)] pb-[calc(var(--player-height)+4rem)] px-4 md:px-8 flex flex-col gap-6 relative z-10">
        {/* Navigation / Header Actions */}
        <div className="flex items-center justify-between">
          <NeonButton onClick={handleBack} variant="ghost" className="p-2">
            <ArrowLeft className="w-4 h-4" /> Back to Generator
          </NeonButton>

          <NeonButton onClick={handleRegenerate} variant="ghost" className="p-2 text-text-muted hover:text-accent-lime">
            <RefreshCw className="w-4 h-4" /> Reset Synth
          </NeonButton>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left / Identity section */}
          <div className="lg:col-span-2 flex flex-col gap-6 w-full">
            <DeveloperCard />
            <GitHubStats />
          </div>

          {/* Right / Audio controls section */}
          <div className="flex flex-col gap-6 w-full lg:sticky lg:top-[calc(var(--nav-height)+2rem)]">
            <WaveformVisualizer />
            
            {/* Retro Cassette Badge */}
            <div className="glass p-5 border-white/5 flex flex-col items-center justify-center bg-[#130b20] relative overflow-hidden rounded-3xl shadow-flat-lilac">
              <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
              <img 
                src="/images/retro_cassette.png" 
                alt="Retro Cassette Tape" 
                className="w-32 h-auto object-contain animate-float-subtle" 
              />
              <span className="text-[10px] text-accent-lime font-mono uppercase tracking-widest mt-3 font-bold">CommitFM Tape-01</span>
            </div>

            <MusicControls />
          </div>
        </div>
      </main>

      <SoundtrackPlayer />
      <MobileNav />
    </>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center relative overflow-hidden select-none">
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full border-t-2 border-accent-lime animate-spin" />
          <h2 className="text-xl font-serif-funky font-bold text-accent-lilac tracking-wide animate-pulse">
            Loading dashboard...
          </h2>
        </div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  );
}
