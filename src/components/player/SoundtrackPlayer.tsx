'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import * as audioEngine from '@/lib/music/engine';
import { genreInfo, mapStatsToMusic } from '@/lib/music/mappings';
import { cn } from '@/lib/utils';

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

  // Initialize and clean up audio engine
  useEffect(() => {
    if (stats) {
      const params = mapStatsToMusic(stats);
      setMusicParams(params);
      setCurrentGenre(params.genre);
    }

    return () => {
      audioEngine.stop();
      setIsPlaying(false);
    };
  }, [stats, setMusicParams, setCurrentGenre, setIsPlaying]);

  // Set up volume mapping
  useEffect(() => {
    audioEngine.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Animate progress bar
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTrackProgress((prev) => (prev >= 100 ? 0 : prev + 0.4));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!stats || !identity) return null;

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenreChange = async (genre: typeof currentGenre) => {
    setCurrentGenre(genre);
    setMusicParams({ genre });
    await audioEngine.changeGenre(genre, { ...musicParams, genre });
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const currentGenreMeta = genreInfo[currentGenre];

  return (
    <div className="fixed bottom-22 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl h-[var(--player-height)] border-1.5 border-white/10 glass bg-[#130b20]/95 backdrop-blur-lg flex items-center justify-between px-6 rounded-full shadow-flat-lilac select-none">
      
      {/* Progress Bar running along the top inner edge */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-violet to-accent-lime transition-all duration-100 ease-linear"
          style={{ width: `${trackProgress}%` }}
        />
      </div>

      {/* Left Side: Dev track details */}
      <div className="flex items-center gap-3 max-w-[30%]">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shadow-sm text-lg",
          isPlaying && "animate-spin-slow"
        )}>
          <span>{currentGenreMeta.emoji}</span>
        </div>
        <div className="overflow-hidden hidden sm:block text-left">
          <h4 className="text-xs font-bold truncate text-white leading-snug">
            {stats.user.name || stats.user.login}
          </h4>
          <p className="text-[10px] text-text-muted truncate font-medium">
            {currentGenreMeta.label}
          </p>
        </div>
      </div>

      {/* Center: Play controls and genre cycle */}
      <div className="flex items-center gap-4">
        {/* Play/Pause pill */}
        <button
          onClick={handlePlayPause}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center bg-accent-lime text-[#0c0714] border border-[#0c0714] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-[2px_2px_0px_#8b5cf6]",
            isPlaying && "bg-accent-lilac text-[#0c0714] shadow-[2px_2px_0px_#a3e635]"
          )}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-[#0c0714] stroke-none" /> : <Play className="w-4 h-4 fill-[#0c0714] stroke-none ml-0.5" />}
        </button>

        {/* Small Genre cycler */}
        <div className="flex items-center gap-0.5 bg-white/5 border border-white/5 p-0.5 rounded-full">
          {(Object.keys(genreInfo) as typeof currentGenre[]).map((g) => (
            <button
              key={g}
              onClick={() => handleGenreChange(g)}
              className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer",
                currentGenre === g
                  ? "bg-accent-lime/10 text-accent-lime border border-accent-lime/25"
                  : "text-text-muted hover:text-text-secondary border border-transparent"
              )}
              title={genreInfo[g].label}
            >
              {g.substring(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Volume control */}
      <div className="flex items-center gap-2 max-w-[25%] justify-end">
        <button
          onClick={handleMuteToggle}
          className="p-1 rounded-md text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-accent-lime" />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            const vol = Number(e.target.value);
            setVolume(vol);
            if (vol > 0 && isMuted) setIsMuted(false);
          }}
          className="w-16 md:w-20 h-1 rounded-full appearance-none cursor-pointer bg-white/10 accent-accent-lime hidden xs:block"
        />
      </div>
      
    </div>
  );
}
