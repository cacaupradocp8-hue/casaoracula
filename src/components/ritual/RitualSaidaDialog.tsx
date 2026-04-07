import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { stampRitualLastAccess } from '@/hooks/useRitualState';

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

const closingPhrases = [
  'o campo continua…',
  'observe o que se move em você',
  'não force. apenas observe.',
  'leve o silêncio com você.',
];

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'fading'>('hidden');
  const [phrase] = useState(() => closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitCalledRef = useRef(false);

  const FADE_IN = 600;
  const HOLD = 1400;
  const FADE_OUT = 600;

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const doFinalExit = useCallback(() => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;
    console.log('[RitualSaida] final exit');
    cleanup();
    setPhase('hidden');
    stampRitualLastAccess();
    onConfirmExit();
  }, [cleanup, onConfirmExit]);

  useEffect(() => {
    if (!open) {
      setPhase('hidden');
      exitCalledRef.current = false;
      return;
    }

    console.log('[RitualSaida] ritual started');
    exitCalledRef.current = false;
    setPhase('playing');

    timerRef.current = setTimeout(() => {
      console.log('[RitualSaida] fading out');
      setPhase('fading');

      timerRef.current = setTimeout(() => {
        doFinalExit();
      }, FADE_OUT);
    }, FADE_IN + HOLD);

    return cleanup;
  }, [open, cleanup, doFinalExit]);

  const handleSkip = useCallback(() => {
    console.log('[RitualSaida] skipped');
    doFinalExit();
  }, [doFinalExit]);

  if (phase === 'hidden') return null;

  const isPlaying = phase === 'playing';

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
        background: 'radial-gradient(ellipse at center, #111c28 0%, #0A0E14 70%, #07090D 100%)',
        cursor: 'default',
        opacity: isPlaying ? 1 : 0,
        transition: `opacity ${FADE_OUT}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {/* Central soft glow */}
      <div
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,106,0.08) 0%, transparent 70%)',
          opacity: isPlaying ? 1 : 0,
          transition: `opacity ${FADE_IN}ms ease-out`,
        }}
      />

      {/* Phrase */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18,
          color: 'rgba(212,175,106,0.55)',
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          textAlign: 'center',
          padding: '0 40px',
          opacity: isPlaying ? 1 : 0,
          transform: isPlaying ? 'translateY(0)' : 'translateY(8px)',
          transition: `opacity ${FADE_IN}ms ease-out, transform ${FADE_IN}ms ease-out`,
        }}
      >
        {phrase}
      </p>

      {/* Skip hint */}
      <p
        style={{
          position: 'absolute',
          bottom: 28,
          fontSize: 9,
          color: 'rgba(212,175,106,0.12)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          opacity: isPlaying ? 1 : 0,
          transition: `opacity 0.4s ease-out ${FADE_IN * 0.8}ms`,
        }}
      >
        toque para pular
      </p>
    </div>
  );
}
