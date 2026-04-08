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

/* ── Generative tone via Web Audio API ── */
function playRitualTone(duration = 2.8): { stop: () => void } {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const end = now + duration;

    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(174, now);
    osc1.frequency.exponentialRampToValueAtTime(160, end);

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261, now);
    osc2.frequency.exponentialRampToValueAtTime(248, end);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.045, now + 0.8);
    gain1.gain.linearRampToValueAtTime(0, end);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.018, now + 1.0);
    gain2.gain.linearRampToValueAtTime(0, end);

    osc1.connect(gain1).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(end);
    osc2.start(now);
    osc2.stop(end);

    console.log('[RitualSaida] tone playing');
    return {
      stop: () => {
        try { osc1.stop(); osc2.stop(); ctx.close(); } catch {}
      },
    };
  } catch (e) {
    console.warn('[RitualSaida] tone failed:', e);
    return { stop: () => {} };
  }
}

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'fading'>('hidden');
  const [phrase] = useState(() => closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const toneRef = useRef<{ stop: () => void } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitCalledRef = useRef(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const FADE_IN = 1200;
  const HOLD = 3000;
  const FADE_OUT = 1200;
  const TONE_DURATION = (FADE_IN + HOLD + FADE_OUT) / 1000;

  // Load custom audio URL once
  useEffect(() => {
    supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'ritual_saida_audio_url')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) setCustomAudioUrl(data.value);
      });
  }, []);

  const cleanup = useCallback(() => {
    toneRef.current?.stop();
    toneRef.current = null;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } catch {}
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

    // Audio — custom URL or generative tone
    if (customAudioUrl) {
      try {
        const audio = new Audio(customAudioUrl);
        audio.volume = 0.25;
        audioRef.current = audio;
        audio.play().then(() => {
          console.log('[RitualSaida] custom audio playing');
        }).catch((e) => {
          console.warn('[RitualSaida] custom audio failed, using tone:', e);
          toneRef.current = playRitualTone(TONE_DURATION);
        });
      } catch {
        toneRef.current = playRitualTone(TONE_DURATION);
      }
    } else {
      toneRef.current = playRitualTone(TONE_DURATION);
    }

    timerRef.current = setTimeout(() => {
      console.log('[RitualSaida] fading out');
      setPhase('fading');

      timerRef.current = setTimeout(() => {
        doFinalExit();
      }, FADE_OUT);
    }, FADE_IN + HOLD);

    return cleanup;
  }, [open, customAudioUrl, cleanup, doFinalExit, TONE_DURATION]);

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
