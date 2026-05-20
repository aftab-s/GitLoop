'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import * as audioEngine from '@/lib/music/engine';
import { genreInfo, mapStatsToMusic } from '@/lib/music/mappings';
import { cn } from '@/lib/utils';

// Procedural loop duration — 4 minutes per "track"
const LOOP_DURATION_S = 240;
const TICK_MS = 100;
const TICK_STEP = 100 / ((LOOP_DURATION_S * 1000) / TICK_MS);

function formatTime(progress: number): string {
  const totalSeconds = Math.floor((progress / 100) * LOOP_DURATION_S);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function SoundtrackPlayer() {
  const {
    stats,
    identity,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    currentGenre,
    setCurrentGenre,
    musicParams,
    setMusicParams,
  } = useAppStore();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [trackProgress, setTrackProgress] = useState(0);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Initialize
  useEffect(() => {
    if (stats) {
      const params = mapStatsToMusic(stats);
      setMusicParams(params);
      setCurrentGenre(params.genre);
    }
    return () => { audioEngine.stop(); setIsPlaying(false); };
  }, [stats, setMusicParams, setCurrentGenre, setIsPlaying]);

  // Volume sync
  useEffect(() => {
    audioEngine.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Progress tick
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTrackProgress((p) => (p >= 100 ? 0 : p + TICK_STEP));
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        audioEngine.stop();
        setIsPlaying(false);
      } else {
        await audioEngine.initEngine();
        await audioEngine.play(musicParams);
        setIsPlaying(true);
      }
    } catch (err) { console.error(err); }
  };

  const handleGenreChange = async (genre: typeof currentGenre) => {
    setCurrentGenre(genre);
    setMusicParams({ genre });
    await audioEngine.changeGenre(genre, { ...musicParams, genre });
  };

  const handleMuteToggle = () => {
    if (isMuted) { setVolume(prevVolume); setIsMuted(false); }
    else { setPrevVolume(volume); setVolume(0); setIsMuted(true); }
  };

  // Seek interaction — moves both the visual bar and the audio transport position
  const seekToPosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!seekBarRef.current) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newProgress = pct * 100;
    setTrackProgress(newProgress);
    // Seek the audio engine to the corresponding second in the loop cycle
    audioEngine.seekTo((pct * LOOP_DURATION_S) % LOOP_DURATION_S);
  }, []);

  const handleSeekMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    seekToPosition(e);
    const onMove = (ev: MouseEvent) => { if (isDragging.current) seekToPosition(ev); };
    const onUp = () => { isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  if (!stats || !identity) return null;

  const currentGenreMeta = genreInfo[currentGenre];
  const totalTime = `${Math.floor(LOOP_DURATION_S / 60)}:${(LOOP_DURATION_S % 60).toString().padStart(2, '0')}`;
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="fixed bottom-20 md:bottom-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl select-none">
      <div className="bg-[#0e0819]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

        {/* ── Seek bar ───────────────────────────────────── */}
        <div
          ref={seekBarRef}
          className="relative h-1 bg-white/5 cursor-pointer group"
          onMouseDown={handleSeekMouseDown}
        >
          {/* Filled */}
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent-violet to-accent-lime transition-none"
            style={{ width: `${trackProgress}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            style={{ left: `${trackProgress}%` }}
          />
        </div>

        {/* ── Main controls row ──────────────────────────── */}
        <div className="flex items-center gap-4 px-4 py-3">

          {/* Left: track info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center bg-white/[0.05] border border-white/8 text-lg flex-shrink-0 transition-all duration-300',
              isPlaying && 'animate-spin-slow border-accent-lime/20'
            )}>
              {currentGenreMeta.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {stats.user.name || stats.user.login}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {currentGenreMeta.label} · Procedural
              </p>
            </div>
          </div>

          {/* Center: play + time */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] font-mono text-text-muted tabular-nums hidden sm:block">
              {formatTime(trackProgress)}
            </span>

            <button
              onClick={handlePlayPause}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 flex-shrink-0',
                isPlaying
                  ? 'bg-accent-lilac/15 border border-accent-lilac/25 text-accent-lilac'
                  : 'bg-accent-lime text-[#0c0714]'
              )}
            >
              {isPlaying
                ? <Pause className="w-4 h-4 fill-current stroke-none" />
                : <Play className="w-4 h-4 fill-current stroke-none ml-0.5" />
              }
            </button>

            <span className="text-[10px] font-mono text-white/20 tabular-nums hidden sm:block">
              {totalTime}
            </span>
          </div>

          {/* Right: volume */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button onClick={handleMuteToggle} className="flex-shrink-0 text-text-muted hover:text-white transition-colors cursor-pointer p-1">
              <VolumeIcon className="w-3.5 h-3.5" />
            </button>
            {/* Volume track */}
            <div className="relative h-1 w-20 bg-white/8 rounded-full cursor-pointer group hidden sm:block"
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                const vol = Math.round(pct * 100);
                setVolume(vol);
                if (vol > 0 && isMuted) setIsMuted(false);
                const onMove = (ev: MouseEvent) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  const p = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
                  setVolume(Math.round(p * 100));
                };
                const onUp = () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', onUp);
              }}
            >
              <div className="absolute inset-y-0 left-0 bg-accent-lime/70 rounded-full transition-none" style={{ width: `${isMuted ? 0 : volume}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${isMuted ? 0 : volume}%` }} />
            </div>
          </div>
        </div>

        {/* ── Genre selector ─────────────────────────────── */}
        <div className="flex items-center gap-1 px-4 pb-3">
          {(Object.keys(genreInfo) as typeof currentGenre[]).map((g) => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1',
                currentGenre === g
                  ? 'bg-white/8 text-white border border-white/10'
                  : 'text-text-muted hover:text-text-secondary border border-transparent hover:border-white/5'
              )}
              title={genreInfo[g].description}
            >
              <span>{genreInfo[g].emoji}</span>
              <span className="hidden xs:inline">{genreInfo[g].label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
