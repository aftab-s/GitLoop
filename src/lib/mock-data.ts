import type { DeveloperStats, ContributionDay, GitHubEvent, GitHubRepo } from '@/types/github';

// ═══════════════════════════════════════════════════════════
// Mock GitHub Profiles for Demo Mode
// ═══════════════════════════════════════════════════════════

function generateContributionGraph(densityMultiplier: number): ContributionDay[] {
  const days: ContributionDay[] = [];
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Random commits based on day of week and random factor
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    let count = 0;
    
    if (Math.random() < 0.8) {
      count = Math.floor(Math.random() * (isWeekend ? 3 : 8) * densityMultiplier);
    }
    
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 10) level = 4;
    else if (count >= 6) level = 3;
    else if (count >= 3) level = 2;
    else if (count >= 1) level = 1;

    days.push({ date: dateStr, count, level });
  }
  return days;
}

export const mockDeveloperStats: Record<string, DeveloperStats> = {
  // Midnight Hacker (synthwave/cyberpunk)
  'neoncoder': {
    user: {
      login: 'neoncoder',
      id: 1048203,
      avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      name: 'Alex Rivera',
      bio: 'Synthesizing clean code in the dark. Infatuated with Rust, WebGL, and custom mechanical keyboards.',
      public_repos: 42,
      followers: 1337,
      following: 88,
      created_at: '2018-04-12T23:14:02Z',
      html_url: 'https://github.com/neoncoder',
      location: 'Neo-Tokyo',
      company: 'Grid Systems Inc.',
      blog: 'https://neoncoder.dev',
      twitter_username: 'neoncoder_dev',
    },
    repos: [
      {
        id: 101,
        name: 'quantum-gl',
        full_name: 'neoncoder/quantum-gl',
        description: 'High-performance WebGL2 creative coding engine written in Rust and compiled to WebAssembly.',
        language: 'Rust',
        stargazers_count: 512,
        forks_count: 32,
        open_issues_count: 4,
        html_url: 'https://github.com/neoncoder/quantum-gl',
        created_at: '2022-01-15T12:00:00Z',
        updated_at: '2026-05-18T22:00:00Z',
        pushed_at: '2026-05-19T02:30:00Z',
        size: 12480,
        topics: ['rust', 'webgl', 'webassembly', 'creative-coding', 'graphics'],
        fork: false,
      },
      {
        id: 102,
        name: 'synth-db',
        full_name: 'neoncoder/synth-db',
        description: 'A time-series database optimized for audio streaming data and telemetry metrics.',
        language: 'Go',
        stargazers_count: 245,
        forks_count: 18,
        open_issues_count: 2,
        html_url: 'https://github.com/neoncoder/synth-db',
        created_at: '2023-04-10T10:00:00Z',
        updated_at: '2026-05-15T01:00:00Z',
        pushed_at: '2026-05-15T04:15:00Z',
        size: 8920,
        topics: ['go', 'database', 'time-series', 'telemetry'],
        fork: false,
      },
      {
        id: 103,
        name: 'hyper-terminal',
        full_name: 'neoncoder/hyper-terminal',
        description: 'A retro-futuristic terminal emulator styling engine using canvas and customized GLSL shaders.',
        language: 'TypeScript',
        stargazers_count: 820,
        forks_count: 56,
        open_issues_count: 12,
        html_url: 'https://github.com/neoncoder/hyper-terminal',
        created_at: '2021-08-20T04:00:00Z',
        updated_at: '2026-05-19T23:00:00Z',
        pushed_at: '2026-05-20T01:00:00Z',
        size: 4560,
        topics: ['typescript', 'terminal', 'retro', 'shaders', 'canvas'],
        fork: false,
      }
    ],
    languages: {
      Rust: 452000,
      TypeScript: 280000,
      Go: 154000,
      JavaScript: 98000,
      GLSL: 45000,
      Shell: 12000,
    },
    totalStars: 1577,
    totalForks: 106,
    totalCommits: 842,
    topLanguages: [
      { name: 'Rust', percentage: 43.4, bytes: 452000 },
      { name: 'TypeScript', percentage: 26.9, bytes: 280000 },
      { name: 'Go', percentage: 14.8, bytes: 154000 },
      { name: 'JavaScript', percentage: 9.4, bytes: 98000 },
      { name: 'GLSL', percentage: 4.3, bytes: 45000 },
      { name: 'Shell', percentage: 1.2, bytes: 12000 },
    ],
    contributionData: generateContributionGraph(1.5),
    longestStreak: 24,
    currentStreak: 12,
    activeHours: [2, 1, 0, 0, 1, 5, 2, 0, 0, 1, 2, 4, 3, 2, 4, 6, 8, 12, 18, 22, 25, 28, 30, 24], // Heavy night coding
    recentEvents: [],
    averageCommitsPerDay: 4.8,
    totalRepos: 42,
    accountAgeDays: 2960,
  },
  
  // Ambient Architect (ambient/lofi)
  'zen_dev': {
    user: {
      login: 'zen_dev',
      id: 2049284,
      avatar_url: 'https://images.unsplash.com/photo-1618005198143-e528346d7a51?w=150&auto=format&fit=crop&q=80',
      name: 'Maya Lin',
      bio: 'Crafting minimalist architectures and elegant APIs. Morning coder, tea drinker, open source believer.',
      public_repos: 18,
      followers: 432,
      following: 120,
      created_at: '2020-11-05T08:30:00Z',
      html_url: 'https://github.com/zen_dev',
      location: 'Vancouver, BC',
      company: 'ZenFlow Systems',
      blog: 'https://zenflow.io',
      twitter_username: 'zen_dev_tweets',
    },
    repos: [
      {
        id: 201,
        name: 'rest-calm',
        full_name: 'zen_dev/rest-calm',
        description: 'A light-weight, highly-cacheable REST framework with built-in rate-limiting and query optimization.',
        language: 'Python',
        stargazers_count: 180,
        forks_count: 14,
        open_issues_count: 1,
        html_url: 'https://github.com/zen_dev/rest-calm',
        created_at: '2023-01-20T08:00:00Z',
        updated_at: '2026-05-18T10:00:00Z',
        pushed_at: '2026-05-18T11:30:00Z',
        size: 2480,
        topics: ['python', 'rest-api', 'minimalist', 'framework', 'cache'],
        fork: false,
      },
      {
        id: 202,
        name: 'aurora-theme',
        full_name: 'zen_dev/aurora-theme',
        description: 'A soothing VS Code theme featuring muted pastels, custom italics, and visual hierarchy elements.',
        language: 'CSS',
        stargazers_count: 320,
        forks_count: 8,
        open_issues_count: 0,
        html_url: 'https://github.com/zen_dev/aurora-theme',
        created_at: '2022-05-12T09:00:00Z',
        updated_at: '2026-05-10T16:00:00Z',
        pushed_at: '2026-05-10T17:00:00Z',
        size: 1540,
        topics: ['theme', 'vscode', 'design', 'minimalist'],
        fork: false,
      }
    ],
    languages: {
      Python: 320000,
      CSS: 120000,
      HTML: 80000,
      JavaScript: 60000,
    },
    totalStars: 500,
    totalForks: 22,
    totalCommits: 310,
    topLanguages: [
      { name: 'Python', percentage: 55.2, bytes: 320000 },
      { name: 'CSS', percentage: 20.7, bytes: 120000 },
      { name: 'HTML', percentage: 13.8, bytes: 80000 },
      { name: 'JavaScript', percentage: 10.3, bytes: 60000 },
    ],
    contributionData: generateContributionGraph(0.8),
    longestStreak: 15,
    currentStreak: 4,
    activeHours: [0, 0, 0, 0, 0, 2, 8, 14, 20, 18, 15, 12, 10, 8, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0], // Heavy morning/afternoon coding
    recentEvents: [],
    averageCommitsPerDay: 2.1,
    totalRepos: 18,
    accountAgeDays: 2022,
  }
};

export function getMockDeveloperStats(username: string): DeveloperStats {
  const normalized = username.toLowerCase().trim();
  if (mockDeveloperStats[normalized]) {
    return mockDeveloperStats[normalized];
  }
  
  // Default generated profile for any other input (randomized neon coder)
  const defaultProfile = mockDeveloperStats['neoncoder'];
  return {
    ...defaultProfile,
    user: {
      ...defaultProfile.user,
      login: username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      avatar_url: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
      bio: `Procedural music creator. Generating a unique sonic representation of code repositories.`,
      html_url: `https://github.com/${username}`,
    }
  };
}
