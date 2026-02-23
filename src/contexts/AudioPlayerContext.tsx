// ============================================
// Global Audio Player Context
// ============================================

import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { AudioTrack } from '@/hooks/useAudioAlbums';

interface PlayerState {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

interface AudioPlayerContextType {
  state: PlayerState;
  play: (track: AudioTrack, startAt?: number) => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  seekRelative: (delta: number) => void;
  setPlaybackRate: (rate: number) => void;
  markCompleted: () => Promise<void>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const [state, setState] = useState<PlayerState>({
    track: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    playbackRate: 1,
  });

  // Create audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });
    audio.addEventListener('loadedmetadata', () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    });
    audio.addEventListener('ended', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });
    audio.addEventListener('pause', () => {
      setState(prev => ({ ...prev, isPlaying: false }));
    });
    audio.addEventListener('play', () => {
      setState(prev => ({ ...prev, isPlaying: true }));
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Save progress every 10s
  useEffect(() => {
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    if (state.track && state.isPlaying && user?.id) {
      saveIntervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (!audio || !state.track) return;
        saveProgress(state.track.id, audio.currentTime, false);
      }, 10000);
    }
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [state.track?.id, state.isPlaying, user?.id]);

  const saveProgress = useCallback(async (trackId: string, posicao: number, concluido: boolean) => {
    if (!user?.id) return;
    await supabase.from('clube_audio_progress').upsert({
      user_id: user.id,
      track_id: trackId,
      posicao_segundos: Math.floor(posicao),
      concluido,
    }, { onConflict: 'user_id,track_id' });
  }, [user?.id]);

  const play = useCallback((track: AudioTrack, startAt?: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (state.track?.id !== track.id) {
      audio.src = track.audio_url;
      audio.load();
    }
    if (startAt !== undefined) audio.currentTime = startAt;
    audio.playbackRate = state.playbackRate;
    audio.play().catch(() => {});
    setState(prev => ({ ...prev, track, isPlaying: true }));
  }, [state.track?.id, state.playbackRate]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    if (state.track) {
      saveProgress(state.track.id, audioRef.current?.currentTime || 0, false);
    }
  }, [state.track, saveProgress]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) pause();
    else if (state.track) play(state.track);
  }, [state.isPlaying, state.track, pause, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
  }, []);

  const seekRelative = useCallback((delta: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + delta));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) audioRef.current.playbackRate = rate;
    setState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  const markCompleted = useCallback(async () => {
    if (!state.track) return;
    await saveProgress(state.track.id, audioRef.current?.currentTime || 0, true);
  }, [state.track, saveProgress]);

  return (
    <AudioPlayerContext.Provider value={{ state, play, pause, togglePlay, seek, seekRelative, setPlaybackRate, markCompleted }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
