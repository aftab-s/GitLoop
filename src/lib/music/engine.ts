'use client';

import type { MusicParams, MusicGenre } from '@/types/github';

// ═══════════════════════════════════════════════════════════
// Procedural Music Engine (Tone.js)
// ═══════════════════════════════════════════════════════════

// We'll dynamically import Tone.js to avoid SSR issues
let Tone: typeof import('tone') | null = null;

interface EngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  synths: Record<string, unknown>;
  loops: unknown[];
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
}

const state: EngineState = {
  isInitialized: false,
  isPlaying: false,
  synths: {},
  loops: [],
  analyser: null,
  audioContext: null,
};

// ═══════════════════════════════════════════════════════════
// Note Scales
// ═══════════════════════════════════════════════════════════

const scales: Record<string, string[]> = {
  synthwave: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
  ambient: ['C3', 'E3', 'G3', 'B3', 'D4', 'F#4', 'A4', 'C5'],
  cyberpunk: ['C3', 'Eb3', 'F3', 'Gb3', 'G3', 'Bb3', 'C4', 'Eb4'],
  lofi: ['C4', 'Eb4', 'F4', 'G4', 'Bb4', 'C5', 'Eb5', 'F5'],
  orchestral: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
};

// ═══════════════════════════════════════════════════════════
// Initialize Audio Engine
// ═══════════════════════════════════════════════════════════

export async function initEngine(): Promise<void> {
  if (state.isInitialized) return;

  try {
    Tone = await import('tone');
    await Tone.start();

    // Create analyser for visualization
    const ctx = Tone.getContext().rawContext as AudioContext;
    state.audioContext = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    // Connect destination to analyser
    Tone.getDestination().connect(analyser);
    state.analyser = analyser;

    state.isInitialized = true;
  } catch (err) {
    console.error('Failed to initialize audio engine:', err);
    throw err;
  }
}

// ═══════════════════════════════════════════════════════════
// Create Instruments per Genre
// ═══════════════════════════════════════════════════════════

function createSynths(genre: MusicGenre, params: MusicParams) {
  if (!Tone) return;

  // Cleanup previous synths
  disposeSynths();

  const volume = -12 + (params.energy / 100) * 8; // -12 to -4 dB

  switch (genre) {
    case 'synthwave': {
      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.3, decay: 0.5, sustain: 0.7, release: 1.5 },
        volume: volume - 6,
      }).toDestination();

      const lead = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 0.8 },
        volume: volume - 3,
      }).toDestination();

      const bass = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        filter: { Q: 2, frequency: 300, type: 'lowpass' },
        envelope: { attack: 0.05, decay: 0.3, sustain: 0.5, release: 0.5 },
        volume: volume - 2,
      }).toDestination();

      state.synths = { pad, lead, bass };
      break;
    }

    case 'ambient': {
      const pad = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 1.5, decay: 2, sustain: 0.8, release: 3 },
        volume: volume - 4,
      }).toDestination();

      const shimmer = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.5, decay: 1, sustain: 0.3, release: 2 },
        volume: volume - 8,
      }).toDestination();

      state.synths = { pad, shimmer };
      break;
    }

    case 'cyberpunk': {
      const lead = new Tone.Synth({
        oscillator: { type: 'pwm', modulationFrequency: 0.5 },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.4 },
        volume: volume - 3,
      }).toDestination();

      const bass = new Tone.MonoSynth({
        oscillator: { type: 'square' },
        filter: { Q: 4, frequency: 200, type: 'lowpass' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
        volume: volume,
      }).toDestination();

      const noise = new Tone.NoiseSynth({
        noise: { type: 'pink' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0 },
        volume: volume - 15,
      }).toDestination();

      state.synths = { lead, bass, noise };
      break;
    }

    case 'lofi': {
      const keys = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.1, decay: 0.4, sustain: 0.3, release: 1 },
        volume: volume - 4,
      }).toDestination();

      const bass = new Tone.MonoSynth({
        oscillator: { type: 'sine' },
        filter: { Q: 1, frequency: 400, type: 'lowpass' },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.5, release: 0.8 },
        volume: volume - 2,
      }).toDestination();

      state.synths = { keys, bass };
      break;
    }

    case 'orchestral': {
      const strings = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.8, decay: 1, sustain: 0.7, release: 2 },
        volume: volume - 6,
      }).toDestination();

      const melody = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.2, decay: 0.5, sustain: 0.6, release: 1 },
        volume: volume - 3,
      }).toDestination();

      state.synths = { strings, melody };
      break;
    }
  }
}

// ═══════════════════════════════════════════════════════════
// Create Loops
// ═══════════════════════════════════════════════════════════

function createLoops(genre: MusicGenre, params: MusicParams) {
  if (!Tone) return;

  // Stop and dispose existing loops
  for (const loop of state.loops) {
    (loop as { stop: () => void; dispose: () => void }).stop();
    (loop as { stop: () => void; dispose: () => void }).dispose();
  }
  state.loops = [];

  const scale = scales[genre];
  const bpm = params.bpm;
  Tone.getTransport().bpm.value = bpm;

  const { synths } = state;

  switch (genre) {
    case 'synthwave': {
      // Pad chord progression
      if (synths.pad) {
        const padLoop = new Tone.Loop((time) => {
          const chord = [scale[0], scale[2], scale[4]];
          (synths.pad as any).triggerAttackRelease(chord, '2n', time);
        }, '1m');
        padLoop.start(0);
        state.loops.push(padLoop);
      }

      // Lead melody
      if (synths.lead) {
        let noteIndex = 0;
        const leadLoop = new Tone.Loop((time) => {
          const note = scale[noteIndex % scale.length];
          (synths.lead as any).triggerAttackRelease(note, '8n', time);
          noteIndex += Math.random() > 0.3 ? 1 : 2;
        }, '4n');
        leadLoop.start('2n');
        state.loops.push(leadLoop);
      }

      // Bass line
      if (synths.bass) {
        const bassLoop = new Tone.Loop((time) => {
          const note = scale[0].replace(/\d/, '2');
          (synths.bass as any).triggerAttackRelease(note, '4n', time);
        }, '2n');
        bassLoop.start(0);
        state.loops.push(bassLoop);
      }
      break;
    }

    case 'ambient': {
      if (synths.pad) {
        const padLoop = new Tone.Loop((time) => {
          const chord = [
            scale[Math.floor(Math.random() * 4)],
            scale[Math.floor(Math.random() * 4) + 2],
            scale[Math.floor(Math.random() * 3) + 5],
          ];
          (synths.pad as any).triggerAttackRelease(chord, '2m', time);
        }, '2m');
        padLoop.start(0);
        state.loops.push(padLoop);
      }

      if (synths.shimmer) {
        const shimmerLoop = new Tone.Loop((time) => {
          if (Math.random() > 0.4) {
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
        let idx = 0;
        const leadLoop = new Tone.Loop((time) => {
          const note = scale[idx % scale.length];
          (synths.lead as any).triggerAttackRelease(note, '16n', time);
          idx += Math.random() > 0.5 ? 1 : 3;
        }, '8n');
        leadLoop.start(0);
        state.loops.push(leadLoop);
      }

      if (synths.bass) {
        const bassLoop = new Tone.Loop((time) => {
          const note = scale[0].replace(/\d/, '2');
          (synths.bass as any).triggerAttackRelease(note, '8n', time);
        }, '4n');
        bassLoop.start(0);
        state.loops.push(bassLoop);
      }

      if (synths.noise) {
        const noiseLoop = new Tone.Loop((time) => {
          if (Math.random() > 0.6) {
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
        let chordIdx = 0;
        const chords = [
          [scale[0], scale[2], scale[4]],
          [scale[1], scale[3], scale[5]],
          [scale[3], scale[5], scale[7]],
          [scale[2], scale[4], scale[6]],
        ];
        const keysLoop = new Tone.Loop((time) => {
          const chord = chords[chordIdx % chords.length];
          (synths.keys as any).triggerAttackRelease(chord, '2n', time);
          chordIdx++;
        }, '1m');
        keysLoop.start(0);
        state.loops.push(keysLoop);
      }

      if (synths.bass) {
        const bassLoop = new Tone.Loop((time) => {
          const note = scale[Math.floor(Math.random() * 3)].replace(/\d/, '2');
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
          const chord = [scale[0], scale[2], scale[4], scale[5]];
          (synths.strings as any).triggerAttackRelease(chord, '1m', time);
        }, '2m');
        stringsLoop.start(0);
        state.loops.push(stringsLoop);
      }

      if (synths.melody) {
        let noteIdx = 0;
        const melodyLoop = new Tone.Loop((time) => {
          const note = scale[noteIdx % scale.length];
          (synths.melody as any).triggerAttackRelease(note, '4n', time);
          noteIdx++;
        }, '2n');
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
    try {
      (synth as { dispose: () => void }).dispose();
    } catch {
      // ignore
    }
  }
  state.synths = {};
}

// ═══════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════

export async function play(params: MusicParams): Promise<void> {
  if (!state.isInitialized) await initEngine();
  if (!Tone) return;

  createSynths(params.genre, params);
  createLoops(params.genre, params);

  Tone.getTransport().start();
  state.isPlaying = true;
}

export function stop(): void {
  if (!Tone || !state.isPlaying) return;

  Tone.getTransport().stop();
  Tone.getTransport().cancel();

  for (const loop of state.loops) {
    try {
      (loop as { stop: () => void; dispose: () => void }).stop();
      (loop as { stop: () => void; dispose: () => void }).dispose();
    } catch {
      // ignore
    }
  }
  state.loops = [];

  disposeSynths();
  state.isPlaying = false;
}

export function setVolume(vol: number): void {
  if (!Tone) return;
  // vol is 0–100, map to -40 to 0 dB
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

export async function changeGenre(
  genre: MusicGenre,
  params: MusicParams
): Promise<void> {
  const wasPlaying = state.isPlaying;
  stop();
  if (wasPlaying) {
    await play({ ...params, genre });
  }
}
