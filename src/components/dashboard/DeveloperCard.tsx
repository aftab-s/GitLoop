'use client';

import React from 'react';
import { Sparkles, Terminal, Calendar, Award } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '../ui/GlassCard';

export function DeveloperCard() {
  const { stats, identity } = useAppStore();

  if (!stats || !identity) return null;

  const creationDate = new Date(stats.user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <GlassCard variant="strong" className="relative overflow-hidden p-6 border-white/5 hover:border-accent-lilac/30 transition-all shadow-flat">
      {/* Background Aura Pulse (subtle) */}
      <div 
        className="absolute top-0 right-0 w-36 h-36 rounded-full filter blur-[60px] opacity-10 pointer-events-none"
        style={{ backgroundColor: identity.color }}
      />
      
      <div className="flex flex-col md:flex-row gap-6 items-center relative z-10">
        {/* Avatar with clean border */}
        <div className="relative">
          <div 
            className="w-20 h-20 rounded-2xl p-[1.5px] relative z-10"
            style={{ 
              background: `linear-gradient(135deg, ${identity.color}, #a3e635)` 
            }}
          >
            <img 
              src={stats.user.avatar_url} 
              alt={stats.user.login} 
              className="w-full h-full object-cover rounded-[14px] bg-bg-secondary"
            />
          </div>
        </div>

        {/* Developer info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-2xl font-serif-funky font-bold tracking-tight text-white">
              {stats.user.name || stats.user.login}
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent-lime/10 text-accent-lime border border-accent-lime/20 self-center md:self-auto">
              @{stats.user.login}
            </span>
          </div>

          <div className="mt-1.5 flex items-center justify-center md:justify-start gap-1.5 text-xs text-text-muted">
            <Terminal className="w-3.5 h-3.5 text-accent-lime" />
            <span>Developer Profile</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <Calendar className="w-3.5 h-3.5 text-accent-lilac" />
            <span>Joined {creationDate}</span>
          </div>

          <p className="mt-3 text-sm text-text-secondary italic max-w-xl">
            &ldquo;{stats.user.bio || 'Exploring the boundaries of technology & creativity.'}&rdquo;
          </p>
        </div>
      </div>

      <div className="section-divider my-6" />

      {/* Identity Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
        {/* Archetype */}
        <div className="glass-subtle p-4 flex flex-col gap-1 items-center sm:items-start rounded-2xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-accent-lilac" />
            Archetype
          </span>
          <span className="text-sm font-bold text-white text-center sm:text-left">
            {identity.archetype}
          </span>
        </div>

        {/* Aura */}
        <div className="glass-subtle p-4 flex flex-col gap-1 items-center sm:items-start rounded-2xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-accent-lime" />
            Aura
          </span>
          <span 
            className="text-sm font-bold flex items-center gap-2"
            style={{ color: identity.color }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: identity.color }} />
            {identity.aura}
          </span>
        </div>

        {/* Mood */}
        <div className="glass-subtle p-4 flex flex-col gap-1 items-center sm:items-start rounded-2xl">
          <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted flex items-center gap-1">
            <span className="text-xs">⚡</span>
            Coding Mood
          </span>
          <span className="text-sm font-bold text-white text-center sm:text-left">
            {identity.mood}
          </span>
        </div>
      </div>

      {/* Lore */}
      <div className="mt-4 p-4 rounded-xl bg-accent-lilac/5 border border-white/5 flex items-center gap-3 relative z-10">
        <div className="text-lg">📜</div>
        <div className="text-xs text-text-secondary leading-relaxed">
          <strong className="text-accent-lilac">Lore:</strong> {identity.lore}
        </div>
      </div>
    </GlassCard>
  );
}
