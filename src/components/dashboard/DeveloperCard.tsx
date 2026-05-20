'use client';

import React from 'react';
import { Sparkles, Terminal, Calendar, Award, Zap } from 'lucide-react';
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
    <GlassCard variant="subtle" className="relative overflow-hidden p-6 border-white/8 hover:border-white/15 transition-all duration-300">
      {/* Subtle aura glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full filter blur-[80px] opacity-[0.06] pointer-events-none"
        style={{ backgroundColor: identity.color }}
      />

      <div className="flex flex-col md:flex-row gap-5 items-start md:items-center relative z-10">
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-2xl p-[1.5px] flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${identity.color}80, #a3e63580)` }}
        >
          <img
            src={stats.user.avatar_url}
            alt={stats.user.login}
            className="w-full h-full object-cover rounded-[13px] bg-bg-secondary"
          />
        </div>

        {/* Name & meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h2 className="text-xl font-bold tracking-tight text-white">
              {stats.user.name || stats.user.login}
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-accent-lime/8 text-accent-lime border border-accent-lime/15">
              @{stats.user.login}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-text-muted mb-2">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-accent-lime/70" />
              Developer Profile
            </span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-accent-lilac/70" />
              Joined {creationDate}
            </span>
          </div>

          {stats.user.bio && (
            <p className="text-xs text-text-secondary italic leading-relaxed max-w-lg">
              &ldquo;{stats.user.bio}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-white/5" />

      {/* Identity Stats — minimal inline pills */}
      <div className="grid grid-cols-3 gap-3 relative z-10">
        <div className="flex flex-col gap-1 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
          <span className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
            <Award className="w-3 h-3 text-accent-lilac/60" />
            Archetype
          </span>
          <span className="text-xs font-semibold text-white leading-tight">{identity.archetype}</span>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
          <span className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-accent-lime/60" />
            Aura
          </span>
          <span className="text-xs font-semibold flex items-center gap-1.5 leading-tight" style={{ color: identity.color }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: identity.color }} />
            {identity.aura}
          </span>
        </div>

        <div className="flex flex-col gap-1 p-3 rounded-xl border border-white/5 bg-white/[0.02]">
          <span className="text-[10px] uppercase tracking-wider text-text-muted flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400/60" />
            Mood
          </span>
          <span className="text-xs font-semibold text-white leading-tight">{identity.mood}</span>
        </div>
      </div>

      {/* Lore — slim bottom strip */}
      <div className="mt-4 px-4 py-3 rounded-xl bg-white/[0.025] border border-white/5 flex items-start gap-2.5 relative z-10">
        <span className="text-sm flex-shrink-0 mt-0.5">📜</span>
        <p className="text-[11px] text-text-secondary leading-relaxed">
          <span className="text-accent-lilac font-semibold">Lore: </span>
          {identity.lore}
        </p>
      </div>
    </GlassCard>
  );
}
