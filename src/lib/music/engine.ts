'use client';

import type { MusicParams, MusicGenre } from '@/types/github';

let Tone: typeof import('tone') | null = null;

interface EngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  synths: Record<string, any>;
  effects: Record<string, any>;
  loops: any[];
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
}

const state: EngineState = {
  isInitialized: false,
  isPlaying: false,
  synths: {},
  effects: {},
  loops: [],
  analyser: null,
  audioContext: null,
};

// ═══════════════════════════════════════════════════════════
// Music Theory — Scale & Chord System
// ═══════════════════════════════════════════════════════════

const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

const MODES: Record<string, number[]> = {
  major:      [0, 2, 4, 5, 7, 9, 11],
  minor:      [0, 2, 3, 5, 7, 8, 10],
  dorian:     [0, 2, 3, 5, 7, 9, 10],
  phrygian:   [0, 1, 3, 5, 7, 8, 10],
  lydian:     [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

// Chord progressions as scale-degree indices
const PROGRESSIONS: Record<string, number[]> = {
  simple:  [0, 4],
  classic: [0, 3, 4, 0],
  pop:     [0, 5, 3, 4],
  jazz:    [1, 4, 0, 5],
};

function selectMode(genre: MusicGenre, mood: 'day' | 'night'): string {
  if (genre === 'cyberpunk') return mood === 'night' ? 'phrygian' : 'minor';
  if (genre === 'ambient')   return mood === 'night' ? 'dorian'   : 'lydian';
  if (genre === 'lofi')      return mood === 'night' ? 'minor'    : 'dorian';
  if (genre === 'orchestral') return mood === 'day'  ? 'major'    : 'minor';
  return mood === 'night' ? 'minor' : 'mixolydian'; // synthwave
}

function selectProgression(complexity: number): number[] {
  if (complexity < 35) return PROGRESSIONS.simple;
  if (complexity < 55) return PROGRESSIONS.classic;
  if (complexity < 75) return PROGRESSIONS.pop;
  return PROGRESSIONS.jazz;
}

// Root note index — deterministic per user: 12 possible roots
function deriveRootIdx(bpm: number, energy: number): number {
  return (Math.round(bpm) + Math.round(energy)) % 12;
}

// Note step size from energy + tempo
function selectStep(energy: number, tempo: number): string {
  const score = (energy + tempo) / 2;
  if (score < 30) return '2n';
  if (score < 50) return '4n';
  if (score < 70) return '8n';
  return '16n';
}

// Chord voice count from complexity
function chordVoices(complexity: number): number {
  if (complexity < 40) return 2;
  if (complexity < 60) return 3;
  if (complexity < 80) return 4;
  return 5;
}

// Build a playable scale array
function buildScale(rootIdx: number, modeName: string, octave: number): string[] {
  const intervals = MODES[modeName] ?? MODES.minor;
  const notes: string[] = [];
  for (const i of intervals) {
    notes.push(`${NOTE_NAMES[(rootIdx + i) % 12]}${octave}`);
  }
  notes.push(`${NOTE_NAMES[rootIdx]}${octave + 1}`); // octave cap
  return notes;
}

// Build a chord from a scale degree
function buildChord(
  rootIdx: number,
  modeName: string,
  degree: number,
  octave: number,
  voices: number
): string[] {
  const intervals = MODES[modeName] ?? MODES.minor;
  const len = intervals.length;
  const chord: string[] = [];
  for (let v = 0; v < voices; v++) {
    const degIdx = (degree + v * 2) % len;
    const noteIdx = (rootIdx + intervals[degIdx]) % 12;
    const noteOct = octave + Math.floor((degree + v * 2) / len);
    chord.push(`${NOTE_NAMES[noteIdx]}${noteOct}`);
  }
  return chord;
}

// Map instrument name to oscillator type
function instrumentToOsc(instrument: string): OscillatorType | string {
  if (!instrument) return 'sawtooth';
  const lower = instrument.toLowerCase();
  if (lower.includes('pad') || lower.includes('soft') || lower.includes('sine')) return 'sine';
  if (lower.includes('industrial') || lower.includes('bass') || lower.includes('distort')) return 'sawtooth';
  if (lower.includes('pluck') || lower.includes('triangle') || lower.includes('bell') || lower.includes('crystal')) return 'triangle';
  if (lower.includes('glitch') || lower.includes('square') || lower.includes('electronic')) return 'square';
  return 'sawtooth';
}

// ═══════════════════════════════════════════════════════════
// Initialize Audio Engine
// ═══════════════════════════════════════════════════════════

export async function initEngine(): Promise<void> {
  if (state.isInitialized) return;
  try {
    Tone = await import('tone');
    await Tone.start();
    const ctx = Tone.getContext().rawContext as AudioContext;
    state.audioContext = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    Tone.getDestination().connect(analyser);
    state.analyser = analyser;
    state.isInitialized = true;
  } catch (err) {
    console.error('Failed to initialize audio engine:', err);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════
// Effects Chain — driven by MusicParams
// ═══════════════════════════════════════════════════════════

async function buildEffectsChain(params: MusicParams): Promise<any> {
  if (!Tone) return null;
  disposeEffects();

  const reverbDecay = 0.8 + (params.ambience / 100) * 5;
  const reverbWet   = (params.ambience / 100) * 0.7;
  const delayWet    = (params.complexity / 100) * 0.3;
  const distAmt     = (params.glitch / 80) * 0.65;
  const distWet     = (params.glitch / 80) * 0.45;
  const filterFreq  = 300 + (params.bass / 100) * 6500;

  // Build chain: synths → distortion → delay → reverb → filter → destination
  const masterFilter = new Tone.Filter({
    type: 'lowpass',
    frequency: filterFreq,
    rolloff: -12,
  }).toDestination();

  const reverb = new Tone.Reverb({ decay: reverbDecay, wet: reverbWet });
  await reverb.generate();
  reverb.connect(masterFilter);

  const delay = new Tone.FeedbackDelay({
    delayTime: '8n.',
    feedback: (params.complexity / 100) * 0.4,
    wet: delayWet,
  });
  delay.connect(reverb);

  const distortion = new Tone.Distortion({ distortion: distAmt, wet: distWet });
  distortion.connect(delay);

  state.effects = { masterFilter, reverb, delay, distortion };
  return distortion; // synths connect here
}

// ═══════════════════════════════════════════════════════════
// Create Synths — oscillator type driven by instruments array
// ═══════════════════════════════════════════════════════════

function createSynths(genre: MusicGenre, params: MusicParams, target: any) {
  if (!Tone) return;
  disposeSynths();

  const out = target ?? Tone.getDestination();
  const vol = -14 + (params.energy / 100) * 8;

  // Primary oscillator type from top instrument
  const osc1 = instrumentToOsc(params.instruments[0] ?? '');
  const osc2 = instrumentToOsc(params.instruments[1] ?? '');

  switch (genre) {
    case 'synthwave': {
      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: osc1 as any },
        envelope: { attack: 0.3, decay: 0.4, sustain: 0.6, release: 1.5 },
        volume: vol - 5,
      });
      pad.connect(out);

      const lead = new Tone.Synth({
        oscillator: { type: osc2 as any },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.6 },
        volume: vol - 2,
      });
      lead.connect(out);

      const bass = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        filter: { Q: 3, frequency: 200 + (params.bass / 100) * 600, type: 'lowpass' },
        envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.4 },
        volume: vol,
      });
      bass.connect(out);

      state.synths = { pad, lead, bass };
      break;
    }

    case 'ambient': {
      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 1.5 + (params.ambience / 100), decay: 2, sustain: 0.8, release: 3 },
        volume: vol - 4,
      });
      pad.connect(out);

      const shimmer = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.5, decay: 1, sustain: 0.3, release: 2 },
        volume: vol - 8,
      });
      shimmer.connect(out);

      state.synths = { pad, shimmer };
      break;
    }

    case 'cyberpunk': {
      const lead = new Tone.Synth({
        oscillator: { type: 'pwm', modulationFrequency: 0.2 + (params.glitch / 80) * 0.8 } as any,
        envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.3 },
        volume: vol - 2,
      });
      lead.connect(out);

      const bass = new Tone.MonoSynth({
        oscillator: { type: 'square' },
        filter: { Q: 4, frequency: 150 + (params.bass / 100) * 500, type: 'lowpass' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
        volume: vol,
      });
      bass.connect(out);

      const noise = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.01, decay: 0.08, sustain: 0 },
        volume: vol - 12 + (params.glitch / 80) * 6,
      });
      noise.connect(out);

      state.synths = { lead, bass, noise };
      break;
    }

    case 'lofi': {
      const keys = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.08, decay: 0.4, sustain: 0.3, release: 1 },
        volume: vol - 3,
      });
      keys.connect(out);

      const bass = new Tone.MonoSynth({
        oscillator: { type: 'sine' },
        filter: { Q: 1, frequency: 300 + (params.bass / 100) * 500, type: 'lowpass' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8 },
        volume: vol - 1,
      });
      bass.connect(out);

      state.synths = { keys, bass };
      break;
    }

    case 'orchestral': {
      const strings = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.6 + (params.complexity / 100) * 0.4, decay: 1, sustain: 0.7, release: 2 },
        volume: vol - 5,
      });
      strings.connect(out);

      const melody = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.2, decay: 0.4, sustain: 0.6, release: 1 },
        volume: vol - 2,
      });
      melody.connect(out);

      state.synths = { strings, melody };
      break;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Create Loops — unique per user via scale/chord/rhythm params
// ═══════════════════════════════════════════════════════════

function createLoops(genre: MusicGenre, params: MusicParams) {
  if (!Tone) return;

  // Clear old loops
  for (const loop of state.loops) {
    try { (loop as any).stop().dispose(); } catch { /* ignore */ }
  }
  state.loops = [];

  Tone.getTransport().bpm.value = params.bpm;

  // ── Derive unique musical identity per user ──────────────
  const rootIdx    = deriveRootIdx(params.bpm, params.energy);
  const modeName   = selectMode(genre, params.mood);
  const progression = selectProgression(params.complexity);
  const noteStep   = selectStep(params.energy, params.tempo);
  const voices     = chordVoices(params.complexity);
  const scale      = buildScale(rootIdx, modeName, 4);
  const bassScale  = buildScale(rootIdx, modeName, 2);
  const glitchProb = params.glitch / 80; // 0→1 probability of glitch trigger

  const { synths } = state;
  let chordStep = 0;
  let leadIdx   = 0;

  switch (genre) {
    case 'synthwave': {
      // Pad — chord progression, voice count from complexity
      if (synths.pad) {
        const padLoop = new Tone.Loop((time) => {
          const degree = progression[chordStep % progression.length];
          const chord  = buildChord(rootIdx, modeName, degree, 4, voices);
          (synths.pad as any).triggerAttackRelease(chord, '1m', time);
          chordStep++;
        }, '1m');
        padLoop.start(0);
        state.loops.push(padLoop);
      }

      // Lead — melody walks the user's unique scale with energy-driven step size
      if (synths.lead) {
        const leadLoop = new Tone.Loop((time) => {
          const note = scale[leadIdx % scale.length];
          (synths.lead as any).triggerAttackRelease(note, noteStep, time);
          leadIdx += Math.random() > 0.4 ? 1 : 2;
        }, noteStep);
        leadLoop.start('1m');
        state.loops.push(leadLoop);
      }

      // Bass — root movement
      if (synths.bass) {
        const bassLoop = new Tone.Loop((time) => {
          const degree = progression[chordStep % progression.length];
          const intervals = MODES[modeName] ?? MODES.minor;
          const noteIdx = (rootIdx + intervals[degree % intervals.length]) % 12;
          (synths.bass as any).triggerAttackRelease(
            `${NOTE_NAMES[noteIdx]}2`, '4n', time
          );
        }, '2n');
        bassLoop.start(0);
        state.loops.push(bassLoop);
      }
      break;
    }

    case 'ambient': {
      if (synths.pad) {
        const padLoop = new Tone.Loop((time) => {
          const degree = progression[chordStep % progression.length];
          const chord  = buildChord(rootIdx, modeName, degree, 3, voices);
          (synths.pad as any).triggerAttackRelease(chord, '2m', time);
          chordStep++;
        }, '2m');
        padLoop.start(0);
        state.loops.push(padLoop);
      }

      if (synths.shimmer) {
        const shimmerLoop = new Tone.Loop((time) => {
          if (Math.random() > 0.45) {
            const note = scale[Math.floor(Math.random() * scale.length)];
            (synths.shimmer as any).triggerAttackRelease(note, '1m', time);
          }
        }, '1m');
        shimmerLoop.start('1m');
        state.loops.push(shimmerLoop);
      }
      break;
    }

    case 'cyberpunk': {
      if (synths.lead) {
        const leadLoop = new Tone.Loop((time) => {
          const note = scale[leadIdx % scale.length];
          (synths.lead as any).triggerAttackRelease(note, '16n', time);
          leadIdx += Math.random() > (1 - glitchProb) ? 3 : 1;
        }, noteStep);
        leadLoop.start(0);
        state.loops.push(leadLoop);
      }

      if (synths.bass) {
        const bassLoop = new Tone.Loop((time) => {
          (synths.bass as any).triggerAttackRelease(bassScale[0], '8n', time);
        }, '4n');
        bassLoop.start(0);
        state.loops.push(bassLoop);
      }

      if (synths.noise) {
        const noiseLoop = new Tone.Loop((time) => {
          if (Math.random() < glitchProb * 0.6) {
            (synths.noise as any).triggerAttackRelease('32n', time);
          }
        }, '8n');
        noiseLoop.start(0);
        state.loops.push(noiseLoop);
      }
      break;
    }

    case 'lofi': {
      if (synths.keys) {
        const keysLoop = new Tone.Loop((time) => {
          const degree = progression[chordStep % progression.length];
          const chord  = buildChord(rootIdx, modeName, degree, 4, Math.min(voices, 4));
          (synths.keys as any).triggerAttackRelease(chord, '2n', time);
          chordStep++;
        }, '1m');
        keysLoop.start(0);
        state.loops.push(keysLoop);
      }

      if (synths.bass) {
        const bassLoop = new Tone.Loop((time) => {
          const note = bassScale[Math.floor(Math.random() * 3)];
          (synths.bass as any).triggerAttackRelease(note, '4n', time);
        }, '2n');
        bassLoop.start(0);
        state.loops.push(bassLoop);
      }
      break;
    }

    case 'orchestral': {
      if (synths.strings) {
        const stringsLoop = new Tone.Loop((time) => {
          const degree = progression[chordStep % progression.length];
          const chord  = buildChord(rootIdx, modeName, degree, 4, voices);
          (synths.strings as any).triggerAttackRelease(chord, '1m', time);
          chordStep++;
        }, '2m');
        stringsLoop.start(0);
        state.loops.push(stringsLoop);
      }

      if (synths.melody) {
        const melodyLoop = new Tone.Loop((time) => {
          const note = scale[leadIdx % scale.length];
          (synths.melody as any).triggerAttackRelease(note, noteStep, time);
          leadIdx++;
        }, noteStep);
        melodyLoop.start('1m');
        state.loops.push(melodyLoop);
      }
      break;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Cleanup
// ═══════════════════════════════════════════════════════════

function disposeSynths() {
  for (const synth of Object.values(state.synths)) {
    try { (synth as any).dispose(); } catch { /* ignore */ }
  }
  state.synths = {};
}

function disposeEffects() {
  for (const fx of Object.values(state.effects)) {
    try { (fx as any).dispose(); } catch { /* ignore */ }
  }
  state.effects = {};
}

// ═══════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════

export async function play(params: MusicParams): Promise<void> {
  if (!state.isInitialized) await initEngine();
  if (!Tone) return;

  // Build effects chain first (async because of Reverb.generate())
  const effectsEntry = await buildEffectsChain(params);

  createSynths(params.genre, params, effectsEntry);
  createLoops(params.genre, params);

  Tone.getTransport().start();
  state.isPlaying = true;
}

export function stop(): void {
  if (!Tone || !state.isPlaying) return;

  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  for (const loop of state.loops) {
    try { (loop as any).stop(); (loop as any).dispose(); } catch { /* ignore */ }
  }
  state.loops = [];

  disposeSynths();
  disposeEffects();
  state.isPlaying = false;
}

export function setVolume(vol: number): void {
  if (!Tone) return;
  const db = -40 + (vol / 100) * 40;
  Tone.getDestination().volume.value = db;
}

export function getAnalyser(): AnalyserNode | null {
  return state.analyser;
}

export function getAudioContext(): AudioContext | null {
  return state.audioContext;
}

export function isPlaying(): boolean {
  return state.isPlaying;
}

export async function changeGenre(genre: MusicGenre, params: MusicParams): Promise<void> {
  const wasPlaying = state.isPlaying;
  stop();
  if (wasPlaying) {
    await play({ ...params, genre });
  }
}

// Seek to a position in seconds within the current transport cycle
export function seekTo(seconds: number): void {
  if (!Tone) return;
  try {
    Tone.getTransport().seconds = Math.max(0, seconds);
  } catch {
    // Transport may not support seeking in all states — safe to ignore
  }
}
