import type {
  DeveloperStats,
  DeveloperIdentity,
  DeveloperArchetype,
  MusicGenre,
  MusicParams,
} from '@/types/github';

// ═══════════════════════════════════════════════════════════
// Language → Instrument Mapping
// ═══════════════════════════════════════════════════════════

export const languageInstruments: Record<string, string> = {
  Python: 'Soft Synth Pads',
  Rust: 'Industrial Bass',
  Go: 'Digital Plucks',
  JavaScript: 'Electronic Leads',
  TypeScript: 'Polished Synthwave',
  Shell: 'Glitch Percussion',
  'C++': 'Heavy Distortion',
  C: 'Raw Oscillator',
  Java: 'Classic Piano',
  Ruby: 'Warm Guitar',
  PHP: 'Retro Keys',
  Swift: 'Crystal Bells',
  Kotlin: 'Modern Strings',
  Dart: 'Flutter Pads',
  Lua: 'Ambient Chimes',
  Scala: 'Jazz Ensemble',
  Haskell: 'Ethereal Choir',
  Elixir: 'Liquid Bass',
  Clojure: 'Zen Bowls',
  HTML: 'Bright Chords',
  CSS: 'Atmospheric Layers',
  Dockerfile: 'Drone Textures',
  HCL: 'Atmospheric Drones',
};

// ═══════════════════════════════════════════════════════════
// Map GitHub Stats → Music Parameters
// ═══════════════════════════════════════════════════════════

export function mapStatsToMusic(stats: DeveloperStats): MusicParams {
  // BPM from commit frequency (60–160)
  const bpm = Math.min(160, Math.max(60, 60 + stats.averageCommitsPerDay * 10));

  // Energy from total activity
  const energy = Math.min(100, Math.max(10, stats.totalCommits / 2));

  // Ambience from streak consistency
  const ambience = Math.min(100, stats.longestStreak * 5);

  // Glitch from language diversity
  const langCount = stats.topLanguages.length;
  const glitch = Math.min(80, langCount * 10);

  // Complexity from repo count + stars
  const complexity = Math.min(
    100,
    Math.max(20, (stats.totalRepos + stats.totalStars) / 3)
  );

  // Bass from forks (community impact)
  const bass = Math.min(100, Math.max(20, stats.totalForks * 5 + 20));

  // Tempo from energy
  const tempo = Math.min(100, Math.max(20, bpm - 40));

  // Mood from active hours
  const nightHours = stats.activeHours
    .slice(20, 24)
    .concat(stats.activeHours.slice(0, 6))
    .reduce((a, b) => a + b, 0);
  const dayHours = stats.activeHours
    .slice(6, 20)
    .reduce((a, b) => a + b, 0);
  const mood: 'day' | 'night' = nightHours > dayHours ? 'night' : 'day';

  // Genre from dominant traits
  let genre: MusicGenre = 'synthwave';
  if (mood === 'night' && energy > 60) genre = 'cyberpunk';
  else if (ambience > 60 && energy < 40) genre = 'ambient';
  else if (mood === 'day' && complexity < 50) genre = 'lofi';
  else if (complexity > 70 && stats.totalStars > 50) genre = 'orchestral';

  // Instruments from languages
  const instruments = stats.topLanguages
    .slice(0, 5)
    .map((l) => languageInstruments[l.name] || 'Synth Pad')
    .filter(Boolean);

  return {
    bpm: Math.round(bpm),
    energy: Math.round(energy),
    ambience: Math.round(ambience),
    glitch: Math.round(glitch),
    complexity: Math.round(complexity),
    bass: Math.round(bass),
    tempo: Math.round(tempo),
    genre,
    mood,
    instruments,
  };
}

// ═══════════════════════════════════════════════════════════
// Developer Archetype Generation
// ═══════════════════════════════════════════════════════════

const archetypeColors: Record<DeveloperArchetype, string> = {
  'Infrastructure Alchemist': '#06b6d4',
  'Midnight Debugger': '#a855f7',
  'Open Source Nomad': '#14b8a6',
  'Chaotic Hacker': '#ef4444',
  'Systems Architect': '#3b82f6',
  'Pixel Wizard': '#ec4899',
  'Cloud Summoner': '#8b5cf6',
  'Data Weaver': '#f59e0b',
  'Frontend Sorcerer': '#f472b6',
  'Backend Titan': '#6366f1',
};

const auraNames: Record<DeveloperArchetype, string> = {
  'Infrastructure Alchemist': 'Electric Cyan',
  'Midnight Debugger': 'Deep Violet',
  'Open Source Nomad': 'Emerald Glow',
  'Chaotic Hacker': 'Crimson Pulse',
  'Systems Architect': 'Azure Storm',
  'Pixel Wizard': 'Neon Rose',
  'Cloud Summoner': 'Astral Purple',
  'Data Weaver': 'Golden Thread',
  'Frontend Sorcerer': 'Blush Wave',
  'Backend Titan': 'Indigo Force',
};

const moodDescriptions: Record<DeveloperArchetype, string> = {
  'Infrastructure Alchemist': 'Methodical & Precise',
  'Midnight Debugger': 'Intense & Focused',
  'Open Source Nomad': 'Collaborative & Free',
  'Chaotic Hacker': 'Unpredictable & Bold',
  'Systems Architect': 'Strategic & Visionary',
  'Pixel Wizard': 'Creative & Playful',
  'Cloud Summoner': 'Abstract & Powerful',
  'Data Weaver': 'Analytical & Curious',
  'Frontend Sorcerer': 'Expressive & Detail-oriented',
  'Backend Titan': 'Robust & Reliable',
};

const loreTemplates: Record<DeveloperArchetype, string> = {
  'Infrastructure Alchemist':
    'Transforming raw compute into golden pipelines, one config at a time.',
  'Midnight Debugger':
    'When the world sleeps, the bugs reveal themselves to the chosen one.',
  'Open Source Nomad':
    'Wandering the digital frontier, leaving contributions like footprints in code.',
  'Chaotic Hacker':
    'Breaking conventions and building something new from the fragments.',
  'Systems Architect':
    'Seeing the invisible threads that connect every service, every call.',
  'Pixel Wizard':
    'Conjuring interfaces from thin air, making pixels dance with purpose.',
  'Cloud Summoner':
    'Commanding serverless armies with the wave of a YAML file.',
  'Data Weaver':
    'Threading patterns through chaos, finding signal in the noise.',
  'Frontend Sorcerer':
    'Casting spells in CSS, enchanting users one animation at a time.',
  'Backend Titan':
    'Holding the weight of a thousand requests without breaking a sweat.',
};

export function generateIdentity(stats: DeveloperStats): DeveloperIdentity {
  const musicParams = mapStatsToMusic(stats);
  const topLang = stats.topLanguages[0]?.name || 'Unknown';

  // Determine archetype based on profile characteristics
  let archetype: DeveloperArchetype;

  const hasInfra =
    stats.topLanguages.some((l) =>
      ['Shell', 'HCL', 'Dockerfile', 'Nix'].includes(l.name)
    ) || stats.repos.some((r) => r.topics?.some((t) => ['devops', 'infra', 'kubernetes', 'docker', 'terraform'].includes(t)));

  const isFrontend = ['JavaScript', 'TypeScript', 'CSS', 'HTML', 'Vue', 'Svelte'].includes(topLang);
  const isNightCoder = musicParams.mood === 'night';
  const isHighEnergy = musicParams.energy > 60;
  const hasHighStars = stats.totalStars > 100;
  const hasManylanguages = stats.topLanguages.length >= 5;
  const isOSSContributor = stats.totalForks > 10;

  if (hasInfra) {
    archetype = 'Infrastructure Alchemist';
  } else if (isNightCoder && isHighEnergy) {
    archetype = 'Midnight Debugger';
  } else if (isOSSContributor && hasManylanguages) {
    archetype = 'Open Source Nomad';
  } else if (isHighEnergy && hasManylanguages && musicParams.glitch > 40) {
    archetype = 'Chaotic Hacker';
  } else if (hasHighStars && stats.totalRepos > 30) {
    archetype = 'Systems Architect';
  } else if (isFrontend && ['CSS', 'HTML'].includes(topLang)) {
    archetype = 'Pixel Wizard';
  } else if (
    stats.repos.some((r) =>
      r.topics?.some((t) => ['cloud', 'aws', 'gcp', 'azure', 'serverless'].includes(t))
    )
  ) {
    archetype = 'Cloud Summoner';
  } else if (['Python', 'R', 'Julia'].includes(topLang)) {
    archetype = 'Data Weaver';
  } else if (isFrontend) {
    archetype = 'Frontend Sorcerer';
  } else {
    archetype = 'Backend Titan';
  }

  return {
    archetype,
    genre: musicParams.genre,
    aura: auraNames[archetype],
    mood: moodDescriptions[archetype],
    lore: loreTemplates[archetype],
    color: archetypeColors[archetype],
  };
}

// ═══════════════════════════════════════════════════════════
// Genre Display Info
// ═══════════════════════════════════════════════════════════

export const genreInfo: Record<
  MusicGenre,
  { label: string; description: string; emoji: string; color: string }
> = {
  synthwave: {
    label: 'Synthwave',
    description: 'Retro-futuristic electronic vibes',
    emoji: '🌆',
    color: '#a855f7',
  },
  ambient: {
    label: 'Ambient',
    description: 'Atmospheric and meditative soundscapes',
    emoji: '🌊',
    color: '#06b6d4',
  },
  cyberpunk: {
    label: 'Cyberpunk',
    description: 'Dark, gritty electronic intensity',
    emoji: '⚡',
    color: '#ef4444',
  },
  lofi: {
    label: 'Lo-Fi',
    description: 'Chill beats for focused coding',
    emoji: '☕',
    color: '#f59e0b',
  },
  orchestral: {
    label: 'Orchestral',
    description: 'Grand, sweeping symphonic compositions',
    emoji: '🎻',
    color: '#3b82f6',
  },
};
