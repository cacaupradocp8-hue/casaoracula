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

/* ── Detect mobile ── */
const isMobile = () => window.innerWidth < 768;

/* ── Refined generative tone via Web Audio API ── */
function playRitualTone(duration = 2.8): { stop: () => void } {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const end = now + duration;

    // Fundamental — warm low drone
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(174, now);
    osc1.frequency.exponentialRampToValueAtTime(160, end);

    // Soft harmonic — fifth above, very quiet
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261, now);
    osc2.frequency.exponentialRampToValueAtTime(248, end);

    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.045, now + 0.8);
    gain1.gain.linearRampToValueAtTime(0.04, end - 0.6);
    gain1.gain.linearRampToValueAtTime(0, end);

    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.018, now + 1.0);
    gain2.gain.linearRampToValueAtTime(0.015, end - 0.6);
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

/* ── Premium Sacred Mandala ── */
function SacredMandala({ size = 200, glowing = false }: { size?: number; glowing?: boolean }) {
  const c = size / 2;
  const gold = '#D4AF6A';
  const goldLight = '#E8D5A8';
  const goldFaint = 'rgba(212,175,106,0.12)';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ filter: glowing ? `drop-shadow(0 0 18px rgba(212,175,106,0.25))` : 'none', transition: 'filter 1.2s ease' }}>
      {/* Outermost whisper ring */}
      <circle cx={c} cy={c} r={size * 0.48} fill="none" stroke={gold} strokeWidth="0.3" opacity="0.1" />

      {/* Outer ring */}
      <circle cx={c} cy={c} r={size * 0.44} fill="none" stroke={gold} strokeWidth="0.5" opacity="0.2" />

      {/* Decorative outer dots — 24 */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.44;
        return (
          <circle key={`od-${i}`} cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r}
            r={0.8} fill={gold} opacity={i % 2 === 0 ? 0.3 : 0.15} />
        );
      })}

      {/* Petal ring 1 — 12 petals, elliptical */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.36;
        const deg = (i / 12) * 360 - 90;
        return (
          <ellipse key={`p1-${i}`}
            cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r}
            rx={size * 0.028} ry={size * 0.055}
            fill="none" stroke={gold} strokeWidth="0.4" opacity="0.22"
            transform={`rotate(${deg} ${c + Math.cos(a) * r} ${c + Math.sin(a) * r})`}
          />
        );
      })}

      {/* Petal ring 2 — 8 petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2 + Math.PI / 8;
        const r = size * 0.26;
        const deg = (i / 8) * 360 - 90 + 22.5;
        return (
          <ellipse key={`p2-${i}`}
            cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r}
            rx={size * 0.022} ry={size * 0.042}
            fill="none" stroke={goldLight} strokeWidth="0.35" opacity="0.18"
            transform={`rotate(${deg} ${c + Math.cos(a) * r} ${c + Math.sin(a) * r})`}
          />
        );
      })}

      {/* Radial lines — very subtle */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <line key={`l-${i}`}
            x1={c + Math.cos(a) * size * 0.1} y1={c + Math.sin(a) * size * 0.1}
            x2={c + Math.cos(a) * size * 0.44} y2={c + Math.sin(a) * size * 0.44}
            stroke={gold} strokeWidth="0.2" opacity="0.07" />
        );
      })}

      {/* Inner ring */}
      <circle cx={c} cy={c} r={size * 0.15} fill="none" stroke={gold} strokeWidth="0.4" opacity="0.2" />

      {/* Inner petal ring — 6 small petals */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.15;
        const deg = (i / 6) * 360 - 90;
        return (
          <ellipse key={`p3-${i}`}
            cx={c + Math.cos(a) * r} cy={c + Math.sin(a) * r}
            rx={size * 0.015} ry={size * 0.032}
            fill="none" stroke={goldLight} strokeWidth="0.3" opacity="0.16"
            transform={`rotate(${deg} ${c + Math.cos(a) * r} ${c + Math.sin(a) * r})`}
          />
        );
      })}

      {/* Center glow */}
      <radialGradient id="center-glow">
        <stop offset="0%" stopColor={gold} stopOpacity="0.25" />
        <stop offset="100%" stopColor={gold} stopOpacity="0" />
      </radialGradient>
      <circle cx={c} cy={c} r={size * 0.06} fill="url(#center-glow)" />

      {/* Center dot */}
      <circle cx={c} cy={c} r="2" fill={gold} opacity="0.4" />
      <circle cx={c} cy={c} r="5" fill="none" stroke={gold} strokeWidth="0.4" opacity="0.2" />
    </svg>
  );
}

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'hidden' | 'playing' | 'fading'>('hidden');
  const [phrase] = useState(() => closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const [glowing, setGlowing] = useState(false);
  const toneRef = useRef<{ stop: () => void } | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitCalledRef = useRef(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  // Responsive timing
  const mobile = isMobile();
  const FADE_IN = mobile ? 500 : 600;
  const HOLD = mobile ? 1200 : 1600;
  const FADE_OUT = mobile ? 500 : 650;
  const TOTAL_VISIBLE = FADE_IN + HOLD;
  const TONE_DURATION = (TOTAL_VISIBLE + FADE_OUT) / 1000;

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
    setGlowing(false);
    stampRitualLastAccess();
    onConfirmExit();
  }, [cleanup, onConfirmExit]);

  // Start ritual when open becomes true
  useEffect(() => {
    if (!open) {
      setPhase('hidden');
      setGlowing(false);
      exitCalledRef.current = false;
      return;
    }

    console.log('[RitualSaida] ritual started');
    exitCalledRef.current = false;
    setPhase('playing');

    // Trigger glow after fade-in
    setTimeout(() => setGlowing(true), FADE_IN * 0.6);

    // Audio
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

    // After visible duration → fade out
    timerRef.current = setTimeout(() => {
      console.log('[RitualSaida] fading out');
      setGlowing(false);
      setPhase('fading');

      timerRef.current = setTimeout(() => {
        doFinalExit();
      }, FADE_OUT);
    }, TOTAL_VISIBLE);

    return cleanup;
  }, [open, customAudioUrl, cleanup, doFinalExit, FADE_IN, TOTAL_VISIBLE, FADE_OUT, TONE_DURATION]);

  // Click to skip
  const handleSkip = useCallback(() => {
    console.log('[RitualSaida] skipped');
    doFinalExit();
  }, [doFinalExit]);

  if (phase === 'hidden') return null;

  const isPlaying = phase === 'playing';
  const mandalaSize = mobile ? 170 : 210;

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
      {/* Ambient glow behind mandala */}
      <div
        style={{
          position: 'absolute',
          width: mobile ? 260 : 340,
          height: mobile ? 260 : 340,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,106,0.06) 0%, rgba(212,175,106,0.02) 40%, transparent 70%)',
          opacity: isPlaying ? 0.7 : 0,
          transition: `opacity ${FADE_IN}ms ease-out`,
        }}
      />

      {/* Mandala container with rotation + scale */}
      <div
        style={{
          opacity: isPlaying ? 1 : 0,
          transform: isPlaying ? 'scale(1) rotate(6deg)' : 'scale(0.96) rotate(0deg)',
          transition: `opacity ${FADE_IN}ms ease-out, transform ${TOTAL_VISIBLE}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <SacredMandala size={mandalaSize} glowing={glowing} />
      </div>

      {/* Phrase */}
      <p
        style={{
          marginTop: mobile ? 36 : 48,
          fontFamily: "'Cormorant Garamond', 'Playfair Display', serif",
          fontSize: mobile ? 13 : 14,
          color: 'rgba(212,175,106,0.4)',
          fontStyle: 'italic',
          letterSpacing: '0.05em',
          textAlign: 'center',
          padding: '0 32px',
          opacity: isPlaying ? 1 : 0,
          transform: isPlaying ? 'translateY(0)' : 'translateY(6px)',
          transition: `opacity ${FADE_IN + 200}ms ease-out ${FADE_IN * 0.5}ms, transform ${FADE_IN + 200}ms ease-out ${FADE_IN * 0.5}ms`,
        }}
      >
        {phrase}
      </p>

      {/* Skip hint */}
      <p
        style={{
          position: 'absolute',
          bottom: mobile ? 24 : 32,
          fontSize: 9,
          color: 'rgba(212,175,106,0.12)',
          letterSpacing: '0.22em',
          textTransform: 'uppercase' as const,
          opacity: isPlaying ? 1 : 0,
          transition: `opacity 0.5s ease-out ${FADE_IN}ms`,
        }}
      >
        toque para pular
      </p>
    </div>
  );
}
