import { useState, useRef, useEffect, useCallback } from 'react';
import { stampRitualLastAccess } from '@/hooks/useRitualState';
import { BreathingMandala } from '@/components/visitor/BreathingMandala';

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
  'o que foi tocado, continua a vibrar.',
  'você não sai da Casa — a Casa segue em você.',
  'feche os olhos. o campo já está selado.',
  'o silêncio que resta… é a resposta.',
  'não leve conclusões. leve a pergunta.',
  'a travessia não termina aqui.',
];

const FADE_IN = 400;
const HOLD = 1000;
const FADE_OUT = 400;

// CSS for breathing + light rays
const ritualStyles = `
@keyframes ritual-breathe {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.08); opacity: 1; }
}
@keyframes ritual-rays-spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
@keyframes ritual-ray-pulse {
  0%, 100% { opacity: 0.12; }
  50% { opacity: 0.35; }
}
`;

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

  const RAY_COUNT = 12;
  const rays = Array.from({ length: RAY_COUNT }, (_, i) => i);

  return (
    <>
      <style>{ritualStyles}</style>
      <div
        role="dialog"
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
          overflow: 'hidden',
        }}
      >
        {/* Mandala + rays wrapper — rays behind, mandala on top */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Light rays — positioned behind mandala, emanating from center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200vmax',
              height: '200vmax',
              transform: 'translate(-50%, -50%)',
              animation: 'ritual-rays-spin 120s linear infinite',
              pointerEvents: 'none',
              zIndex: 0,
              opacity: visible ? 1 : 0,
              transition: `opacity ${FADE_IN}ms ease`,
            }}
          >
            {rays.map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 2,
                  height: '50%',
                  transformOrigin: '50% 0%',
                  transform: `rotate(${(360 / RAY_COUNT) * i}deg)`,
                  background: `linear-gradient(to bottom, rgba(201,164,92,0.3), rgba(201,164,92,0.08) 30%, transparent 70%)`,
                  animation: `ritual-ray-pulse ${3 + (i % 3) * 1.2}s ease-in-out ${(i * 0.4) % 2}s infinite`,
                  filter: 'blur(1.5px)',
                }}
              />
            ))}
          </div>

          {/* Radial glow behind mandala */}
          <div
            style={{
              position: 'absolute',
              width: 320,
              height: 320,
              background: 'radial-gradient(circle, rgba(201,164,92,0.12) 0%, transparent 65%)',
              animation: 'ritual-breathe 6s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Mandala flor — on top with breathing */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              animation: visible ? 'ritual-breathe 6s ease-in-out infinite' : 'none',
              opacity: visible ? 1 : 0,
              transition: `opacity ${FADE_IN}ms ease`,
            }}
          >
            <BreathingMandala />
          </div>
        </div>

        {/* Phrase */}
        <p
          style={{
            position: 'relative',
            zIndex: 1,
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

        {/* Botão Pular */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          style={{
            position: 'relative',
            zIndex: 1,
            marginTop: 16,
            padding: '8px 24px',
            background: 'transparent',
            border: '1px solid rgba(201,164,92,0.3)',
            borderRadius: 8,
            color: 'rgba(201,164,92,0.5)',
            fontSize: 13,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            opacity: visible ? 1 : 0,
            transition: `opacity ${FADE_IN}ms ease 200ms`,
          }}
        >
          Pular e sair
        </button>
      </div>
    </>
  );
}
