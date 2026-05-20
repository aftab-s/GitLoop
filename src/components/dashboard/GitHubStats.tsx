'use client';

import React from 'react';
import { GitCommit, Star, GitFork, FolderGit, Zap } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export function GitHubStats() {
  const { stats } = useAppStore();

  if (!stats) return null;

  const statItems = [
    { label: 'Commits', value: stats.totalCommits, icon: GitCommit, color: 'text-accent-lilac', bg: 'bg-accent-lilac/8' },
    { label: 'Stars', value: stats.totalStars, icon: Star, color: 'text-accent-lime', bg: 'bg-accent-lime/8' },
    { label: 'Forks', value: stats.totalForks, icon: GitFork, color: 'text-blue-400', bg: 'bg-blue-400/8' },
    { label: 'Repos', value: stats.totalRepos, icon: FolderGit, color: 'text-cyan-400', bg: 'bg-cyan-400/8' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Metrics Row — compact and minimal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <GlassCard key={index} variant="subtle" className="p-4 border-white/5 hover:border-white/10 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bg} ${item.color} flex-shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted leading-none mb-1">
                    {item.label}
                  </span>
                  <span className="text-lg font-bold font-mono text-white leading-none">
                    <AnimatedCounter value={item.value} />
                  </span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Languages */}
        <GlassCard variant="subtle" className="p-5 border-white/5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-lime/60" />
            Dominant Languages
          </h3>
          <div className="flex flex-col gap-3.5">
            {stats.topLanguages.length > 0 ? (
              stats.topLanguages.map((lang) => (
                <div key={lang.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-text-primary">{lang.name}</span>
                    <span className="text-[11px] text-text-muted font-mono">{lang.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${lang.percentage}%`,
                        background: 'linear-gradient(90deg, #8b5cf6, #a3e635)',
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted text-center py-6">No language data available.</p>
            )}
          </div>
        </GlassCard>

        {/* Coding Consistency */}
        <GlassCard variant="subtle" className="p-5 border-white/5 flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400/60" />
              Coding Consistency
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white/[0.025] border border-white/5">
                <Zap className="w-4 h-4 text-accent-lime mb-2 opacity-80" />
                <span className="text-[10px] uppercase tracking-wider text-text-muted leading-none mb-1.5">
                  Longest Streak
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  <AnimatedCounter value={stats.longestStreak} />
                </span>
                <span className="text-[10px] text-text-muted mt-0.5">days</span>
              </div>

              <div className="flex flex-col items-center justify-center text-center p-3 rounded-xl bg-white/[0.025] border border-white/5">
                <Zap className="w-4 h-4 text-accent-lilac mb-2 opacity-80" />
                <span className="text-[10px] uppercase tracking-wider text-text-muted leading-none mb-1.5">
                  Current Streak
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  <AnimatedCounter value={stats.currentStreak} />
                </span>
                <span className="text-[10px] text-text-muted mt-0.5">days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/[0.025] border border-white/5 text-[11px] text-text-secondary leading-relaxed">
            Averaging{' '}
            <span className="font-mono text-accent-lilac font-semibold">
              {stats.averageCommitsPerDay.toFixed(1)}
            </span>{' '}
            commits per session across{' '}
            <span className="font-mono text-text-primary font-semibold">{stats.accountAgeDays}</span>{' '}
            active days.
          </div>
        </GlassCard>
      </div>

      {/* Contribution Grid */}
      <GlassCard variant="subtle" className="p-5 border-white/5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-violet/60" />
          Contribution Profile — Last 90 Days
        </h3>
        <div className="flex flex-wrap gap-[3px] items-center">
          {stats.contributionData.map((day, idx) => {
            const levels: Record<number, string> = {
              0: 'bg-white/[0.03]',
              1: 'bg-[#3b235e]/50',
              2: 'bg-[#6329a3]/70',
              3: 'bg-[#8b5cf6]',
              4: 'bg-accent-lime',
            };
            return (
              <div
                key={idx}
                className={`w-3 h-3 rounded-sm transition-all duration-150 hover:scale-110 hover:brightness-125 ${levels[day.level]}`}
                title={`${day.date}: ${day.count} contributions`}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-text-muted">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.03]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#3b235e]/50" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#6329a3]/70" />
          <div className="w-2.5 h-2.5 rounded-sm bg-[#8b5cf6]" />
          <div className="w-2.5 h-2.5 rounded-sm bg-accent-lime" />
          <span>More</span>
        </div>
      </GlassCard>
    </div>
  );
}
