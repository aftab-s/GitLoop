import { create } from 'zustand';
import type {
  DeveloperStats,
  DeveloperIdentity,
  MusicGenre,
  MusicParams,
} from '@/types/github';

// ═══════════════════════════════════════════════════════════
// App Store
// ═══════════════════════════════════════════════════════════

interface AppStore {
  // User
  username: string;
  setUsername: (username: string) => void;

  // Loading
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Error
  error: string | null;
  setError: (error: string | null) => void;

  // GitHub Stats
  stats: DeveloperStats | null;
  setStats: (stats: DeveloperStats | null) => void;

  // Developer Identity
  identity: DeveloperIdentity | null;
  setIdentity: (identity: DeveloperIdentity | null) => void;

  // Audio
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
  currentGenre: MusicGenre;
  setCurrentGenre: (genre: MusicGenre) => void;

  // Music params
  musicParams: MusicParams;
  setMusicParams: (params: Partial<MusicParams>) => void;

  // AI reasoning for music direction
  aiReasoning: string | null;
  setAiReasoning: (reasoning: string | null) => void;

  // Reset
  reset: () => void;
}

const defaultMusicParams: MusicParams = {
  bpm: 120,
  energy: 50,
  ambience: 50,
  glitch: 20,
  complexity: 50,
  bass: 50,
  tempo: 50,
  genre: 'synthwave',
  mood: 'night',
  instruments: [],
};

export const useAppStore = create<AppStore>((set) => ({
  username: '',
  setUsername: (username) => set({ username }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  error: null,
  setError: (error) => set({ error }),

  stats: null,
  setStats: (stats) => set({ stats }),

  identity: null,
  setIdentity: (identity) => set({ identity }),

  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  volume: 75,
  setVolume: (volume) => set({ volume }),
  currentGenre: 'synthwave',
  setCurrentGenre: (currentGenre) => set({ currentGenre }),

  musicParams: defaultMusicParams,
  setMusicParams: (params) =>
    set((state) => ({
      musicParams: { ...state.musicParams, ...params },
    })),

  aiReasoning: null,
  setAiReasoning: (aiReasoning) => set({ aiReasoning }),

  reset: () =>
    set({
      username: '',
      isLoading: false,
      error: null,
      stats: null,
      identity: null,
      isPlaying: false,
      musicParams: defaultMusicParams,
      aiReasoning: null,
    }),
}));
