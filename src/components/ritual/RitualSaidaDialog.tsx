import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { stampRitualLastAccess } from '@/hooks/useRitualState';

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

/* ── Closing phrases ── */
const closingPhrases = [
  'o campo continua…',
  'observe o que se move em você',
  'não force. apenas observe.',
  'leve o silêncio com você.',
];

/* ── Simple generative tone via Web Audio API ── */
function playRitualTone(duration = 2.5): { stop: () => void } {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const end = now + duration;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(174, now);
    osc.frequency.exponentialRampToValueAtTime(164, end);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.6);
    gain.gain.linearRampToValueAtTime(0, end);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(end);

    console.log('[RitualSaida] tone playing');
    return {
      stop: () => {
        try { osc.stop(); ctx.close(); } catch {}
      },
    };
  } catch (e) {
    console.warn('[RitualSaida] tone failed:', e);
    return { stop: () => {} };
  }
}

/* ── Inline SVG Mandala ── */
function SacredMandala({ size = 220 }: { size?: number }) {
  const c = size / 2;
  const color = '#E0B36A';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      {/* Outer rings */}
      <circle cx={c} cy={c} r={size * 0.46} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <circle cx={c} cy={c} r={size * 0.42} fill="none" stroke={color} strokeWidth="0.4" opacity="0.15" />

      {/* Petal ring 1 — 12 petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.38;
        return (
          <circle key={`p1-${i}`} cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r}
            r={size * 0.045} fill="none" stroke={color} strokeWidth="0.4" opacity="0.25" />
        );
      })}

      {/* Petal ring 2 — 8 petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.27;
        return (
          <circle key={`p2-${i}`} cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r}
            r={size * 0.035} fill="none" stroke={color} strokeWidth="0.4" opacity="0.22" />
        );
      })}

      {/* Radial lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <line key={`l-${i}`}
            x1={c + Math.cos(a) * size * 0.08} y1={c + Math.sin(a) * size * 0.08}
            x2={c + Math.cos(a) * size * 0.42} y2={c + Math.sin(a) * size * 0.42}
            stroke={color} strokeWidth="0.3" opacity="0.1" />
        );
      })}

      {/* Inner ring */}
      <circle cx={c} cy={c} r={size * 0.16} fill="none" stroke={color} strokeWidth="0.4" opacity="0.18" />

      {/* Center */}
      <circle cx={c} cy={c} r="2.5" fill={color} opacity="0.35" />
      <circle cx={c} cy={c} r="6" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'fading'>('hidden');
  const [phrase] = useState(() => closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const toneRef = useRef<{ stop: () => void } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitCalledRef = useRef(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const RITUAL_DURATION = 2200; // ms
  const FADE_OUT_DURATION = 600; // ms

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

  // Start ritual when open becomes true
  useEffect(() => {
    if (!open) {
      // Reset when closed
      setPhase('hidden');
      exitCalledRef.current = false;
      return;
    }

    console.log('[RitualSaida] ritual started');
    exitCalledRef.current = false;
    setPhase('playing');

    // Try audio — custom URL or generative tone
    if (customAudioUrl) {
      try {
        const audio = new Audio(customAudioUrl);
        audio.volume = 0.3;
        audioRef.current = audio;
        audio.play().then(() => {
          console.log('[RitualSaida] custom audio playing');
        }).catch((e) => {
          console.warn('[RitualSaida] custom audio failed, using tone:', e);
          toneRef.current = playRitualTone(RITUAL_DURATION / 1000);
        });
      } catch {
        toneRef.current = playRitualTone(RITUAL_DURATION / 1000);
      }
    } else {
      toneRef.current = playRitualTone(RITUAL_DURATION / 1000);
    }

    // After ritual duration → start fade out
    timerRef.current = setTimeout(() => {
      console.log('[RitualSaida] fading out');
      setPhase('fading');

      // After fade out → exit
      timerRef.current = setTimeout(() => {
        doFinalExit();
      }, FADE_OUT_DURATION);
    }, RITUAL_DURATION);

    return cleanup;
  }, [open, customAudioUrl, cleanup, doFinalExit]);

  // Click to skip
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
        backgroundColor: '#0A0E14',
        cursor: 'default',
        opacity: isPlaying ? 1 : 0,
        transition: `opacity ${FADE_OUT_DURATION}ms ease-out`,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,179,106,0.06), transparent 70%)',
          opacity: isPlaying ? 0.5 : 0,
          transition: 'opacity 1s ease-out',
        }}
      />

      {/* Mandala */}
      <div
        style={{
          opacity: isPlaying ? 1 : 0,
          transform: isPlaying ? 'scale(1) rotate(8deg)' : 'scale(0.96) rotate(0deg)',
          transition: 'opacity 1s ease-out, transform 2.2s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <SacredMandala size={220} />
      </div>

      {/* Phrase */}
      <p
        style={{
          marginTop: 48,
          fontFamily: "'Playfair Display', serif",
          fontSize: 14,
          color: 'rgba(224,179,106,0.45)',
          fontStyle: 'italic',
          letterSpacing: '0.04em',
          textAlign: 'center',
          padding: '0 32px',
          opacity: isPlaying ? 1 : 0,
          transform: isPlaying ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 1.2s ease-out 0.5s, transform 1.2s ease-out 0.5s',
        }}
      >
        {phrase}
      </p>

      {/* Skip hint */}
      <p
        style={{
          position: 'absolute',
          bottom: 32,
          fontSize: 10,
          color: 'rgba(224,179,106,0.15)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase' as const,
          opacity: isPlaying ? 1 : 0,
          transition: 'opacity 0.6s ease-out 1.2s',
        }}
      >
        toque para pular
      </p>
    </div>
  );
}
