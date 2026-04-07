import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { stampRitualLastAccess } from '@/hooks/useRitualState';
import { motion, AnimatePresence } from 'framer-motion';

interface RitualSaidaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
}

/* ── Generative ritual tone via Web Audio API ── */
function playRitualTone(duration = 2.5): { stop: () => void } {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    const end = now + duration;

    // Base drone — soft low frequency
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(174, now); // F3 — grounding
    osc1.frequency.exponentialRampToValueAtTime(164, end);
    const gain1 = ctx.createGain();
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.06, now + 0.8);
    gain1.gain.linearRampToValueAtTime(0, end);
    osc1.connect(gain1).connect(ctx.destination);
    osc1.start(now);
    osc1.stop(end);

    // Harmonic — gentle fifth above
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(261, now); // C4
    osc2.frequency.exponentialRampToValueAtTime(246, end);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.03, now + 1);
    gain2.gain.linearRampToValueAtTime(0, end);
    osc2.connect(gain2).connect(ctx.destination);
    osc2.start(now);
    osc2.stop(end);

    return {
      stop: () => {
        try { osc1.stop(); osc2.stop(); ctx.close(); } catch {}
      },
    };
  } catch {
    return { stop: () => {} };
  }
}

/* ── Phrases pool ── */
const closingPhrases = [
  'o campo continua…',
  'observe o que se move em você',
  'não force. apenas observe.',
  'leve o silêncio com você.',
];

export function RitualSaidaDialog({ open, onClose, onConfirmExit }: RitualSaidaDialogProps) {
  const [phase, setPhase] = useState<'idle' | 'ritual' | 'done'>('idle');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toneRef = useRef<{ stop: () => void } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phraseRef = useRef(closingPhrases[Math.floor(Math.random() * closingPhrases.length)]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const ritualDuration = isMobile ? 2200 : 3500;

  // Fetch custom audio URL
  useEffect(() => {
    supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'ritual_saida_audio_url')
      .maybeSingle()
      .then(({ data }) => { if (data?.value) setAudioUrl(data.value); });
  }, []);

  const cleanup = useCallback(() => {
    toneRef.current?.stop();
    toneRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
  }, []);

  const startRitual = useCallback(() => {
    phraseRef.current = closingPhrases[Math.floor(Math.random() * closingPhrases.length)];
    setPhase('ritual');

    // Play audio — prefer custom URL, fallback to generative tone
    if (audioUrl && audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    } else {
      toneRef.current = playRitualTone(ritualDuration / 1000);
    }

    timerRef.current = setTimeout(() => {
      setPhase('done');
      // Auto-exit after brief pause
      timerRef.current = setTimeout(() => {
        handleFinalExit();
      }, 800);
    }, ritualDuration);
  }, [audioUrl, ritualDuration]);

  const handleFinalExit = useCallback(() => {
    cleanup();
    setPhase('idle');
    stampRitualLastAccess();
    onConfirmExit();
  }, [cleanup, onConfirmExit]);

  const handleSkip = useCallback(() => {
    cleanup();
    setPhase('idle');
    stampRitualLastAccess();
    onConfirmExit();
  }, [cleanup, onConfirmExit]);

  const handleOpenChange = useCallback((value: boolean) => {
    if (!value) {
      cleanup();
      setPhase('idle');
      onClose();
    }
  }, [cleanup, onClose]);

  // Start ritual immediately on open
  useEffect(() => {
    if (open && phase === 'idle') {
      startRitual();
    }
  }, [open]);

  // Cleanup on unmount
  useEffect(() => cleanup, [cleanup]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-full w-full h-[100dvh] max-h-[100dvh] p-0 border-none rounded-none bg-[#0A0E14] [&>button]:hidden overflow-hidden">
        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} preload="none" />
        )}

        {/* Click anywhere to skip */}
        <button
          onClick={handleSkip}
          className="absolute inset-0 z-50 cursor-default"
          aria-label="Pular ritual"
        />

        <AnimatePresence mode="wait">
          {phase === 'ritual' && (
            <motion.div
              key="ritual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center z-10"
            >
              {/* Ambient glow */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: isMobile ? 280 : 400,
                  height: isMobile ? 280 : 400,
                  background: 'radial-gradient(circle, rgba(224,179,106,0.08), transparent 70%)',
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              {/* SVG Mandala */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotate: 15 }}
                transition={{
                  scale: { duration: 2.5, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 1.5 },
                  rotate: { duration: ritualDuration / 1000 + 2, ease: 'linear' },
                }}
                className="relative"
                style={{ width: isMobile ? 200 : 280, height: isMobile ? 200 : 280 }}
              >
                <MandalaInline size={isMobile ? 200 : 280} />
              </motion.div>

              {/* Phrase */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8 }}
                className="mt-12 font-display text-sm md:text-base text-[#E0B36A]/50 italic tracking-wide text-center px-8"
              >
                {phraseRef.current}
              </motion.p>

              {/* Skip hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-8 text-[10px] text-[#E0B36A]/20 tracking-[0.2em] uppercase"
              >
                toque para pular
              </motion.p>
            </motion.div>
          )}

          {phase === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#E0B36A]/20" />
                <span className="text-[#E0B36A]/30 text-lg">✧</span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#E0B36A]/20" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* ── Inline SVG Mandala (lightweight, no image dependency) ── */
function MandalaInline({ size = 280 }: { size?: number }) {
  const c = size / 2;
  const color = '#E0B36A';

  const rings = [
    { r: size * 0.42, petals: 12, pr: size * 0.055 },
    { r: size * 0.31, petals: 8, pr: size * 0.04 },
    { r: size * 0.20, petals: 6, pr: size * 0.028 },
  ];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%">
      <circle cx={c} cy={c} r={size * 0.46} fill="none" stroke={color} strokeWidth="0.5" opacity="0.18" />
      <circle cx={c} cy={c} r={size * 0.44} fill="none" stroke={color} strokeWidth="0.3" opacity="0.12" />

      {rings.map((ring, ri) => (
        <g key={ri} opacity={0.28 - ri * 0.04}>
          <circle cx={c} cy={c} r={ring.r} fill="none" stroke={color} strokeWidth="0.4" />
          {Array.from({ length: ring.petals }).map((_, i) => {
            const a = (i / ring.petals) * Math.PI * 2 - Math.PI / 2;
            return (
              <circle
                key={i}
                cx={c + Math.cos(a) * ring.r}
                cy={c + Math.sin(a) * ring.r}
                r={ring.pr}
                fill="none"
                stroke={color}
                strokeWidth="0.4"
                opacity="0.3"
              />
            );
          })}
        </g>
      ))}

      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return (
          <line
            key={i}
            x1={c + Math.cos(a) * size * 0.1}
            y1={c + Math.sin(a) * size * 0.1}
            x2={c + Math.cos(a) * size * 0.44}
            y2={c + Math.sin(a) * size * 0.44}
            stroke={color}
            strokeWidth="0.3"
            opacity="0.1"
          />
        );
      })}

      {[0, 1, 2].map((i) => {
        const a1 = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const a2 = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.14;
        return (
          <line
            key={`t-${i}`}
            x1={c + Math.cos(a1) * r}
            y1={c + Math.sin(a1) * r}
            x2={c + Math.cos(a2) * r}
            y2={c + Math.sin(a2) * r}
            stroke={color}
            strokeWidth="0.5"
            opacity="0.22"
          />
        );
      })}

      <circle cx={c} cy={c} r="2" fill={color} opacity="0.35" />
      <circle cx={c} cy={c} r="5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.18" />
    </svg>
  );
}
