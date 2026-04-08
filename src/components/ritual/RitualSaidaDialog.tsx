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

/* ── Detect mobile for slightly shorter timing ── */
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

/* ── Generative drone via Web Audio API ── */
function playRitualTone(duration = 3.2): { stop: () => void } {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const end = now + duration;

    // Drone fundamental — warm low tone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(174, now);
    osc1.frequency.exponentialRampToValueAtTime(165, end);

    // Harmonic — gentle fifth
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261, now);
    osc2.frequency.exponentialRampToValueAtTime(250, end);

    // Sub-bass for warmth
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(87, now);
    osc3.frequency.exponentialRampToValueAtTime(82, end);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.10, now + 0.9);
    gain1.gain.linearRampToValueAtTime(0.08, end - 0.6);
    gain1.gain.linearRampToValueAtTime(0, end);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.05, now + 1.1);
    gain2.gain.linearRampToValueAtTime(0.04, end - 0.6);
    gain2.gain.linearRampToValueAtTime(0, end);

    const gain3 = ctx.createGain();
    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.06, now + 0.7);
    gain3.gain.linearRampToValueAtTime(0.04, end - 0.5);
    gain3.gain.linearRampToValueAtTime(0, end);

    osc1.connect(gain1).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);
    osc3.connect(gain3).connect(ctx.destination);
    osc1.start(now); osc1.stop(end);
    osc2.start(now); osc2.stop(end);
    osc3.start(now); osc3.stop(end);

    console.log('[RitualSaida] tone playing');
    return {
      stop: () => {
        try { osc1.stop(); osc2.stop(); osc3.stop(); ctx.close(); } catch {}
      },
    };
  } catch (e) {
    console.warn('[RitualSaida] tone failed:', e);
    return { stop: () => {} };
  }
}

/* ── Sacred Mandala SVG ── */
function SacredMandala({ visible }: { visible: boolean }) {
  const size = isMobile ? 160 : 200;
  const cx = size / 2;
  const stroke = 'rgba(212,175,106,0.35)';
  const strokeFine = 'rgba(212,175,106,0.18)';
  const strokeGlow = 'rgba(212,175,106,0.08)';

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.92)',
        transition: 'opacity 800ms ease-out, transform 800ms ease-out',
      }}
    >
      {/* Glow behind mandala */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,106,0.06) 0%, transparent 65%)',
          animation: 'mandala-glow 4s ease-in-out infinite',
        }}
      />
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        style={{
          animation: 'mandala-rotate 90s linear infinite, mandala-pulse 6s ease-in-out infinite',
        }}
      >
        {/* Outer circle */}
        <circle cx={cx} cy={cx} r={cx - 4} fill="none" stroke={stroke} strokeWidth="0.5" />
        {/* Inner circle */}
        <circle cx={cx} cy={cx} r={cx * 0.65} fill="none" stroke={strokeFine} strokeWidth="0.4" />
        {/* Core circle */}
        <circle cx={cx} cy={cx} r={cx * 0.3} fill="none" stroke={stroke} strokeWidth="0.5" />
        {/* Center dot */}
        <circle cx={cx} cy={cx} r={1.5} fill="rgba(212,175,106,0.5)" />

        {/* Radial lines — 12 spokes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = cx + Math.cos(angle) * (cx * 0.3);
          const y1 = cx + Math.sin(angle) * (cx * 0.3);
          const x2 = cx + Math.cos(angle) * (cx - 4);
          const y2 = cx + Math.sin(angle) * (cx - 4);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i % 3 === 0 ? stroke : strokeFine}
              strokeWidth={i % 3 === 0 ? '0.4' : '0.25'}
            />
          );
        })}

        {/* Diamond petals at mid-ring */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const r = cx * 0.48;
          const px = cx + Math.cos(angle) * r;
          const py = cx + Math.sin(angle) * r;
          const d = 8;
          const a1 = angle - Math.PI / 2;
          const a2 = angle + Math.PI / 2;
          return (
            <path
              key={`p${i}`}
              d={`M${px + Math.cos(angle) * d},${py + Math.sin(angle) * d}
                  L${px + Math.cos(a1) * (d * 0.4)},${py + Math.sin(a1) * (d * 0.4)}
                  L${px - Math.cos(angle) * d},${py - Math.sin(angle) * d}
                  L${px + Math.cos(a2) * (d * 0.4)},${py + Math.sin(a2) * (d * 0.4)} Z`}
              fill="none"
              stroke={strokeGlow}
              strokeWidth="0.4"
            />
          );
        })}
      </svg>
    </div>
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

  // Timing — desktop vs mobile
  const FADE_IN = isMobile ? 600 : 700;
  const HOLD = isMobile ? 1400 : 1800;
  const FADE_OUT = isMobile ? 600 : 700;
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
        audio.volume = 0.20;
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
  }, [open, customAudioUrl, cleanup, doFinalExit, TONE_DURATION, FADE_IN, HOLD, FADE_OUT]);

  const handleSkip = useCallback(() => {
    console.log('[RitualSaida] skipped');
    doFinalExit();
  }, [doFinalExit]);

  if (phase === 'hidden') return null;

  const isPlaying = phase === 'playing';

  return (
    <>
      {/* Mandala keyframe animations */}
      <style>{`
        @keyframes mandala-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mandala-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.85; }
        }
        @keyframes mandala-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

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
          gap: isMobile ? 20 : 28,
          background: 'radial-gradient(ellipse at center, #111c28 0%, #0A0E14 60%, #07090D 100%)',
          cursor: 'default',
          opacity: isPlaying ? 1 : 0,
          transition: `opacity ${FADE_OUT}ms cubic-bezier(0.33, 0, 0.2, 1)`,
        }}
      >
        {/* Mandala */}
        <SacredMandala visible={isPlaying} />

        {/* Phrase — below mandala */}
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: isMobile ? 15 : 17,
            color: 'rgba(212,175,106,0.50)',
            fontStyle: 'italic',
            letterSpacing: '0.04em',
            textAlign: 'center',
            padding: '0 40px',
            opacity: isPlaying ? 1 : 0,
            transform: isPlaying ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity ${FADE_IN}ms ease-out 200ms, transform ${FADE_IN}ms ease-out 200ms`,
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
            color: 'rgba(212,175,106,0.10)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            opacity: isPlaying ? 1 : 0,
            transition: `opacity 0.4s ease-out ${FADE_IN + 400}ms`,
          }}
        >
          toque para pular
        </p>
      </div>
    </>
  );
}
