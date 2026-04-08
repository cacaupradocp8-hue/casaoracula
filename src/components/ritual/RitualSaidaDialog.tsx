import { useState, useRef, useEffect, useCallback } from 'react';
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

const FADE_IN = 400;
const HOLD = 1000;
const FADE_OUT = 400;
const TOTAL = FADE_IN + HOLD + FADE_OUT;

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'fading'>('hidden');
  const [phrase] = useState(() => closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitCalledRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const doFinalExit = useCallback(() => {
    if (exitCalledRef.current) return;
    exitCalledRef.current = true;
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

    exitCalledRef.current = false;
    setPhase('playing');

    timerRef.current = setTimeout(() => {
      setPhase('fading');
      timerRef.current = setTimeout(() => {
        doFinalExit();
      }, FADE_OUT);
    }, FADE_IN + HOLD);

    return cleanup;
  }, [open, cleanup, doFinalExit]);

  const handleSkip = useCallback(() => {
    doFinalExit();
  }, [doFinalExit]);

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
