// ═══════════════════════════════════════════════════════════
// GitHub Data Types
// ═══════════════════════════════════════════════════════════

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  twitter_username: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  topics: string[];
  fork: boolean;
}

export interface LanguageStats {
  [language: string]: number; // language -> byte count
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════
// Derived / Computed Stats
// ═══════════════════════════════════════════════════════════

export interface DeveloperStats {
  user: GitHubUser;
  repos: GitHubRepo[];
  languages: LanguageStats;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  topLanguages: Array<{ name: string; percentage: number; bytes: number }>;
  contributionData: ContributionDay[];
  longestStreak: number;
  currentStreak: number;
  activeHours: number[]; // 0-23 hour distribution
  recentEvents: GitHubEvent[];
  averageCommitsPerDay: number;
  totalRepos: number;
  accountAgeDays: number;
}

// ═══════════════════════════════════════════════════════════
// Music System Types
// ═══════════════════════════════════════════════════════════

export type MusicGenre =
  | 'synthwave'
  | 'ambient'
  | 'cyberpunk'
  | 'lofi'
  | 'orchestral';

export interface MusicParams {
  bpm: number;
  energy: number;       // 0–100
  ambience: number;     // 0–100
  glitch: number;       // 0–100
  complexity: number;   // 0–100
  bass: number;         // 0–100
  tempo: number;        // 0–100
  genre: MusicGenre;
  mood: 'day' | 'night';
  instruments: string[];
}

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  currentGenre: MusicGenre;
  params: MusicParams;
}

// ═══════════════════════════════════════════════════════════
// Developer Identity Types
// ═══════════════════════════════════════════════════════════

export type DeveloperArchetype =
  | 'Infrastructure Alchemist'
  | 'Midnight Debugger'
  | 'Open Source Nomad'
  | 'Chaotic Hacker'
  | 'Systems Architect'
  | 'Pixel Wizard'
  | 'Cloud Summoner'
  | 'Data Weaver'
  | 'Frontend Sorcerer'
  | 'Backend Titan';

export interface DeveloperIdentity {
  archetype: DeveloperArchetype;
  genre: MusicGenre;
  aura: string;       // e.g., "Electric Violet"
  mood: string;       // e.g., "Focused & Intense"
  lore: string;       // AI-generated one-liner
  color: string;      // hex color for their aura
}

// ═══════════════════════════════════════════════════════════
// App State Types
// ═══════════════════════════════════════════════════════════

export type AppView = 'landing' | 'loading' | 'dashboard';

export interface AppState {
  view: AppView;
  username: string;
  isLoading: boolean;
  error: string | null;
  stats: DeveloperStats | null;
  identity: DeveloperIdentity | null;
  audio: AudioState;
}
