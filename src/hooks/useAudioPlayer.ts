import { useState, useRef, useEffect, useCallback } from 'react';
import { getPublicAudioUrl, isValidAudioUrl } from '@/lib/audioUtils';

export interface UseAudioPlayerProps {
  audioUrl: string | null | undefined;
}

export function useAudioPlayer({ audioUrl }: UseAudioPlayerProps) {
  const resolvedUrl = getPublicAudioUrl(audioUrl);
  const isValid = isValidAudioUrl(resolvedUrl);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  // Stop other audios when this one starts
  const stopAllOtherAudios = useCallback(() => {
    window.dispatchEvent(new CustomEvent('stop-all-audio', { detail: { id: resolvedUrl } }));
  }, [resolvedUrl]);

  useEffect(() => {
    const handleStopAll = (e: any) => {
      if (e.detail?.id !== resolvedUrl && isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('stop-all-audio', handleStopAll);
    return () => window.removeEventListener('stop-all-audio', handleStopAll);
  }, [resolvedUrl, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onCanPlay = () => setIsLoading(false);
    const onLoadStart = () => setIsLoading(true);
    const onMeta = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onTime = () => setProgress(audio.currentTime);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        stopAllOtherAudios();
        await audio.play();
        setIsPlaying(true);
      } catch (e) {
        console.error("Erro ao reproduzir áudio:", e);
      }
    }
  }, [isPlaying, stopAllOtherAudios]);

  const handleSeek = useCallback((v: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = v[0];
    setProgress(v[0]);
  }, []);

  return {
    audioRef,
    isPlaying,
    isLoading,
    progress,
    duration,
    hasError,
    resolvedUrl,
    isValid,
    togglePlay,
    handleSeek,
    setProgress
  };
}
