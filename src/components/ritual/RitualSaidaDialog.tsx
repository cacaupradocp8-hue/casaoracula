import { useState, useRef, useEffect, useCallback } from 'react';
import { stampRitualLastAccess } from '@/hooks/useRitualState';

export interface RitualSaidaAudioPlayback {
  audio: HTMLAudioElement;
  playbackStarted: Promise<boolean>;
}

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  audioPlayback?: RitualSaidaAudioPlayback | null;
}

const closingPhrases = [
  'o campo continua…',
  'observe o que se move em você',
  'não force. apenas observe.',
  'leve o silêncio com você.',
];

const FADE_IN = 400;
const HOLD = 1000;
const FADE_OUT = 400;

export function RitualSaidaDialog({ open, onClose, onConfirmExit, audioPlayback = null }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'fading'>('hidden');
  const [phrase] = useState(() => closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exitCalledRef = useRef(false);
  const fadeStartedRef = useRef(false);
  const minVisualCompleteRef = useRef(false);
  const audioFinishedRef = useRef(true);
  const cycleActiveRef = useRef(false);
  const detachAudioListenersRef = useRef<(() => void) | null>(null);

  const queueTimeout = useCallback((callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay);
    timersRef.current.push(timeout);
  }, []);

  const cleanup = useCallback(() => {
    cycleActiveRef.current = false;
    timersRef.current.forEach((timeout) => clearTimeout(timeout));
    timersRef.current = [];
    detachAudioListenersRef.current?.();
    detachAudioListenersRef.current = null;
  }, []);

  const doFinalExit = useCallback(() => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;
    cleanup();
    if (audioPlayback?.audio && !audioPlayback.audio.ended) {
      audioPlayback.audio.pause();
      audioPlayback.audio.currentTime = 0;
    }
    setPhase('hidden');
    stampRitualLastAccess();
    onConfirmExit();
  }, [audioPlayback, cleanup, onConfirmExit]);

  const startFadeOut = useCallback(() => {
    if (!cycleActiveRef.current || fadeStartedRef.current || exitCalledRef.current) return;
    fadeStartedRef.current = true;
    setPhase('fading');
    queueTimeout(() => {
      doFinalExit();
    }, FADE_OUT);
  }, [doFinalExit, queueTimeout]);

  useEffect(() => {
    const maybeStartFadeOut = () => {
      if (!cycleActiveRef.current) return;
      if (minVisualCompleteRef.current && audioFinishedRef.current) {
        startFadeOut();
      }
    };

    if (!open) {
      cleanup();
      setPhase('hidden');
      exitCalledRef.current = false;
      fadeStartedRef.current = false;
      minVisualCompleteRef.current = false;
      audioFinishedRef.current = true;
      return;
    }

    exitCalledRef.current = false;
    fadeStartedRef.current = false;
    minVisualCompleteRef.current = false;
    audioFinishedRef.current = !audioPlayback;
    cycleActiveRef.current = true;
    setPhase('playing');

    queueTimeout(() => {
      minVisualCompleteRef.current = true;
      maybeStartFadeOut();
    }, FADE_IN + HOLD);

    if (audioPlayback?.audio) {
      const handleAudioSettled = () => {
        audioFinishedRef.current = true;
        maybeStartFadeOut();
      };

      audioPlayback.audio.addEventListener('ended', handleAudioSettled);
      audioPlayback.audio.addEventListener('error', handleAudioSettled);
      detachAudioListenersRef.current = () => {
        audioPlayback.audio.removeEventListener('ended', handleAudioSettled);
        audioPlayback.audio.removeEventListener('error', handleAudioSettled);
      };

      audioPlayback.playbackStarted
        .then((didStart) => {
          if (!cycleActiveRef.current || didStart) return;
          audioFinishedRef.current = true;
          maybeStartFadeOut();
        })
        .catch(() => {
          if (!cycleActiveRef.current) return;
          audioFinishedRef.current = true;
          maybeStartFadeOut();
        });

      if (audioPlayback.audio.ended) {
        audioFinishedRef.current = true;
      }
    }

    return cleanup;
  }, [open, audioPlayback, cleanup, queueTimeout, startFadeOut]);

  const handleSkip = useCallback(() => {
    onClose();
    doFinalExit();
  }, [doFinalExit, onClose]);

  if (phase === 'hidden') return null;

  const visible = phase === 'playing';

  return (
    <div
      role="dialog"
      onClick={handleSkip}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: '#0A0E14',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_OUT}ms ease`,
      }}
    >
      {/* Simple golden ring */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: '1.5px solid rgba(201,164,92,0.4)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.9)',
          transition: `opacity ${FADE_IN}ms ease, transform ${FADE_IN}ms ease`,
        }}
      />

      {/* Phrase */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 16,
          color: 'rgba(201,164,92,0.5)',
          fontStyle: 'italic',
          letterSpacing: '0.03em',
          textAlign: 'center',
          padding: '0 40px',
          opacity: visible ? 1 : 0,
          transition: `opacity ${FADE_IN}ms ease 100ms`,
        }}
      >
        {phrase}
      </p>
    </div>
  );
}
