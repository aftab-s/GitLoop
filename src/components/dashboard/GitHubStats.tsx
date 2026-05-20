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
    { label: 'Total Commits', value: stats.totalCommits, icon: GitCommit, color: 'text-accent-lilac' },
    { label: 'Stars Earned', value: stats.totalStars, icon: Star, color: 'text-accent-lime' },
    { label: 'Total Forks', value: stats.totalForks, icon: GitFork, color: 'text-blue-400' },
    { label: 'Public Repos', value: stats.totalRepos, icon: FolderGit, color: 'text-cyan-400' },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <GlassCard key={index} className="p-4 flex items-center gap-4 border-white/5 hover:border-accent-lilac/30 rounded-2xl shadow-sm">
              <div className={`p-2.5 rounded-xl bg-white/5 ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  {item.label}
                </span>
                <span className="text-xl font-bold font-mono text-white">
                  <AnimatedCounter value={item.value} />
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Languages */}
        <GlassCard className="p-5 border-white/5 rounded-3xl">
          <h3 className="text-sm font-semibold tracking-tight text-white mb-4 flex items-center gap-2 font-serif-funky text-base">
            <span>📊</span> Dominant Languages
          </h3>
          <div className="flex flex-col gap-4">
            {stats.topLanguages.length > 0 ? (
              stats.topLanguages.map((lang) => (
                <div key={lang.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-text-primary">{lang.name}</span>
                    <span className="text-text-muted font-mono">{lang.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-violet to-accent-lime rounded-full"
                      style={{ width: `${lang.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted text-center py-4">No languages data available.</p>
            )}
          </div>
        </GlassCard>

        {/* Streaks & Strengths */}
        <GlassCard className="p-5 border-white/5 rounded-3xl flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2 font-serif-funky text-base">
              <span>🔥</span> Coding Consistency
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-subtle p-4 flex flex-col items-center justify-center text-center rounded-2xl">
                <Zap className="w-6 h-6 text-accent-lime mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  Longest Streak
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1">
                  <AnimatedCounter value={stats.longestStreak} />
                </span>
                <span className="text-[10px] text-text-muted">days active</span>
              </div>

              <div className="glass-subtle p-4 flex flex-col items-center justify-center text-center rounded-2xl">
                <Zap className="w-6 h-6 text-accent-lilac mb-1 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
                  Current Streak
                </span>
                <span className="text-2xl font-bold font-mono text-white mt-1">
                  <AnimatedCounter value={stats.currentStreak} />
                </span>
                <span className="text-[10px] text-text-muted">days active</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-text-secondary leading-relaxed">
            💡 <strong className="text-accent-lime">Analysis:</strong> You averages{' '}
            <span className="font-mono text-accent-lilac font-bold">
              {stats.averageCommitsPerDay.toFixed(1)}
            </span>{' '}
            commits per active coding session. Your account has been active for{' '}
            <span className="font-mono text-blue-400 font-bold">{stats.accountAgeDays}</span>{' '}
            days!
          </div>
        </GlassCard>
      </div>

      {/* Contribution Grid */}
      <GlassCard className="p-5 border-white/5 rounded-3xl">
        <h3 className="text-sm font-semibold tracking-tight text-white mb-4 flex items-center gap-2 font-serif-funky text-base">
          <span>📅</span> Contribution Profile (Last 90 Days)
        </h3>
        <div className="flex flex-wrap gap-1 items-center justify-center md:justify-start">
          {stats.contributionData.map((day, idx) => {
            const levels = {
              0: 'bg-[#140b20]',
              1: 'bg-[#3b235e]/60 border border-white/5',
              2: 'bg-[#6329a3] border border-white/5',
              3: 'bg-[#8b5cf6] border border-white/5',
              4: 'bg-[#a3e635]',
            };
            return (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 hover:scale-125 ${levels[day.level]}`}
                title={`${day.date}: ${day.count} contributions`}
              />
            );
          })}
        </div>
        <div className="flex justify-end gap-2 text-[10px] font-bold text-text-muted mt-3 uppercase tracking-wider">
          <span>Less</span>
          <div className="w-3 h-3 rounded-sm bg-[#140b20]" />
          <div className="w-3 h-3 rounded-sm bg-[#3b235e]/60" />
          <div className="w-3 h-3 rounded-sm bg-[#6329a3]" />
          <div className="w-3 h-3 rounded-sm bg-[#8b5cf6]" />
          <div className="w-3 h-3 rounded-sm bg-[#a3e635]" />
          <span>More</span>
        </div>
      </GlassCard>
    </div>
  );
}
