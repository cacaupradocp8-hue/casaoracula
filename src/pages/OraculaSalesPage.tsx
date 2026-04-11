import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, Play } from 'lucide-react';

import heroImg from '@/assets/formacao/hero-oracula.png';
import mentoriaBanner from '@/assets/formacao/mentoria-banner.png';
import img02 from '@/assets/formacao/imagem02-new.png';
import img03 from '@/assets/formacao/imagem03-new.png';
import img04 from '@/assets/formacao/imagem04-new.png';
import mentoriaImg from '@/assets/formacao/mentoria01-new.png';
import { ParticleField } from '@/components/sales/ParticleField';

/* ─── PRIMITIVES ─── */

function Phrase({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Spacer({ h = 'md' }: { h?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const map = { sm: 'h-10 md:h-14', md: 'h-16 md:h-24', lg: 'h-24 md:h-36', xl: 'h-32 md:h-48' };
  return <div className={map[h]} aria-hidden />;
}

function GoldButton({
  label,
  onClick,
  variant = 'solid',
}: {
  label: string;
  onClick: () => void;
  variant?: 'solid' | 'outline' | 'glow';
}) {
  const base =
    'w-full max-w-sm py-4 md:py-5 rounded-lg text-[11px] uppercase tracking-[0.25em] font-semibold transition-all duration-500 flex items-center justify-center gap-2 active:scale-[0.97]';
  const styles = {
    outline: 'border border-[#C6A96B]/55 bg-transparent text-[#F3EFE7]/95 hover:bg-[#C6A96B]/12 hover:border-[#C6A96B]/70',
    solid: 'bg-[#C6A96B] text-[#0B0B0F] hover:bg-[#d4b87a]',
    glow: 'bg-[#C6A96B] text-[#0B0B0F] hover:bg-[#d4b87a] shadow-[0_0_80px_-15px_rgba(198,169,107,0.35)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex justify-center px-4"
    >
      <button onClick={onClick} className={`${base} ${styles[variant]}`}>
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ─── VIDEO PLAYER ─── */

function VideoPlayer({ onCtaClick }: { onCtaClick: () => void }) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = useCallback(async () => {
    setPlaying(true);
    await new Promise((r) => setTimeout(r, 50));
    const v = videoRef.current;
    if (!v) return;
    const src =
      'https://customer-xhfrree4xvb8h3z9.cloudflarestream.com/131b6682e30bf25ac6090847e3c511d8/manifest/video.m3u8';
    if (v.canPlayType('application/vnd.apple.mpegurl')) {
      v.src = src;
      v.play();
    } else {
      const Hls = (await import('hls.js')).default;
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(v);
        hls.on(Hls.Events.MANIFEST_PARSED, () => v.play());
      }
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Moldura decorativa externa */}
      <div className="relative p-[3px] rounded-2xl bg-gradient-to-br from-[#C6A96B]/40 via-[#C6A96B]/10 to-[#C6A96B]/30 shadow-[0_0_80px_-20px_rgba(198,169,107,0.15)]">
        <div className="relative rounded-2xl overflow-hidden bg-black/80">
          {/* Moldura interna sutil */}
          <div className="absolute inset-0 rounded-2xl border border-[#C6A96B]/8 pointer-events-none z-20" />
          
          <div className="relative aspect-video">
            {!playing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0B0B0F]">
                <img src={mentoriaBanner} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/90 via-[#0B0B0F]/40 to-[#0B0B0F]/20" />
                {/* Cantos decorativos */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C6A96B]/25 rounded-tl-sm z-10" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#C6A96B]/25 rounded-tr-sm z-10" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#C6A96B]/25 rounded-bl-sm z-10" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#C6A96B]/25 rounded-br-sm z-10" />
                <button
                  onClick={play}
                  className="relative z-10 group flex flex-col items-center gap-4"
                  aria-label="Reproduzir vídeo"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#C6A96B]/30 flex items-center justify-center bg-[#C6A96B]/5 backdrop-blur-sm group-hover:border-[#C6A96B]/70 group-hover:scale-105 transition-all duration-500">
                    <Play className="w-8 h-8 md:w-10 md:h-10 text-[#C6A96B] ml-1" fill="currentColor" />
                  </div>
                  <span className="text-[#F3EFE7]/80 text-xs tracking-wider uppercase">Assistir</span>
                </button>
              </div>
            ) : (
              <video
                ref={videoRef}
                className="w-full h-full object-cover bg-black"
                controls
                playsInline
                controlsList="nodownload"
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <GoldButton label="Entrar na Formação" onClick={onCtaClick} variant="outline" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const heroOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const ctaClick = useCallback(
    () => window.open('https://pay.rockty.com/inn1jdxprkw4gafeubsdww?off=qqqmfhyjku7ou9kc70gg', '_blank'),
    [],
  );

  const [showFloat, setShowFloat] = useState(false);
  useEffect(() => {
    const fn = () => setShowFloat(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] overflow-x-hidden selection:bg-[hsl(var(--primary))/0.3]">

      <ParticleField density={28} color="216,255,62" />

      {/* ═══════════════════════════════
         1. HERO FULLSCREEN
      ═══════════════════════════════ */}

      <motion.section
        ref={heroRef}
        style={{ opacity: heroOp }}
        className="relative min-h-screen flex flex-col items-center justify-center"
      >
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover object-top" loading="eager" />
          <div className="absolute inset-0 bg-[#0B0B0F]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-[#0B0B0F]/40" />
        </motion.div>

        <div className="relative z-10 w-full flex flex-col items-center gap-10 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-center text-[clamp(1.6rem,7vw,3.2rem)] font-light leading-[1.15] tracking-tight max-w-lg"
          >
            Você não precisa de mais técnica.
            <br />
            <span className="text-[#C6A96B]">Precisa parar de conduzir no escuro.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-[hsl(var(--foreground))/0.9] text-base md:text-lg text-center max-w-md"
          >
            A formação que ensina a ler o campo antes de intervir.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <button
              onClick={ctaClick}
              className="bg-[#C6A96B] text-[#0B0B0F] py-4 px-12 rounded-lg text-[11px] uppercase tracking-[0.25em] font-semibold hover:bg-[#d4b87a] active:scale-[0.97] transition-all duration-500"
            >
              Entrar na Formação
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="text-[hsl(var(--foreground))/0.78] text-[11px] tracking-wide"
          >
            Ciclo de 1 ano · Turmas fechadas
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-[#F3EFE7]/15 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════
         2. SCROLL NARRATIVO — Dor
      ═══════════════════════════════ */}

      <section className="px-6 max-w-lg mx-auto">
        <Spacer h="xl" />
        {['Você já estudou.', 'Já atendeu.', 'Já ajudou.'].map((f, i) => (
          <Phrase
            key={i}
            delay={i * 0.04}
            className="font-display text-[clamp(1.2rem,5vw,2rem)] font-light leading-[1.3] text-center text-[hsl(var(--foreground))/0.88] py-[12vh]"
          >
            {f}
          </Phrase>
        ))}

        <Phrase className="font-display text-[clamp(1.4rem,6vw,2.6rem)] font-light leading-[1.2] text-center py-[14vh]">
          <span className="text-[hsl(var(--foreground))/0.82]">E mesmo assim…</span>
          <br />
          <span className="text-[#C6A96B]">Algo não sustenta.</span>
        </Phrase>
      </section>

      {/* Imagem de respiro */}
      <div className="relative overflow-hidden mx-4 md:mx-auto max-w-3xl rounded-xl">
        <img src={img02} alt="Formação" loading="lazy" className="w-full h-auto object-contain" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/30 via-transparent to-[#0B0B0F]/90" />
      </div>

      <Spacer h="xl" />

      {/* ═══════════════════════════════
         3. VÍDEO — Apresentação
      ═══════════════════════════════ */}

      <section className="max-w-3xl mx-auto">
        <Phrase className="font-display text-[clamp(1.2rem,5vw,2rem)] font-light text-center text-[hsl(var(--foreground))/0.88] px-6 mb-10">
          Assista e entenda o que muda quando você <span className="text-[#C6A96B]">aprende a ler</span>.
        </Phrase>
        <VideoPlayer onCtaClick={ctaClick} />
      </section>

      <Spacer h="xl" />

      {/* ═══════════════════════════════
         4. DIAGNÓSTICO — O que falta
      ═══════════════════════════════ */}

      <section className="px-6 max-w-lg mx-auto">
        {[
          { t: 'O mercado ensinou você a conduzir.', dim: true },
          { t: 'Mas não ensinou a ler.', dim: true },
          { t: 'Quando você não lê…', dim: true },
          { t: 'Você interfere no tempo errado.', dim: false },
        ].map((item, i) => (
          <Phrase
            key={i}
            className={`font-display text-lg md:text-xl font-light text-center py-[10vh] ${
              item.dim ? 'text-[hsl(var(--foreground))/0.82]' : 'text-[hsl(var(--foreground))/0.96]'
            }`}
          >
            {item.t}
          </Phrase>
        ))}

        <Phrase className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light text-center py-[12vh]">
          <span className="text-[hsl(var(--foreground))/0.84]">Toda intervenção fora de tempo…</span>
          <br />
          <span className="text-[#C6A96B]">vira invasão simbólica.</span>
        </Phrase>
      </section>

      <GoldButton label="Entrar na Formação" onClick={ctaClick} variant="outline" />
      <Spacer h="xl" />

      {/* ═══════════════════════════════
         5. MÉTODO — CidaDELA
      ═══════════════════════════════ */}

      <div className="relative overflow-hidden mx-4 md:mx-auto max-w-3xl rounded-xl">
        <img src={img03} alt="Método" loading="lazy" className="w-full h-auto object-contain" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/40 via-transparent to-[#0B0B0F]/90" />
      </div>

      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <Phrase className="text-[hsl(var(--primary))] text-sm md:text-base uppercase tracking-[0.35em] text-center mb-8 font-semibold">
            Método da CidaDELA
          </Phrase>

          <div className="space-y-4">
            {[
              { title: 'Portas', desc: 'Em que limiar a psique está.' },
              { title: 'Campos', desc: 'O clima simbólico que pede leitura.' },
              { title: 'Torres', desc: 'O que sustentou essa mulher até aqui.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="border border-[hsl(var(--border))/0.6] bg-[hsl(var(--card))/0.22] rounded-lg p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-[3px] h-full bg-[hsl(var(--primary))/0.8] rounded-full" />
                <h3 className="font-display text-xl text-[hsl(var(--foreground))] font-medium mb-1 pl-3">{item.title}</h3>
                <p className="text-[hsl(var(--foreground))/0.86] text-sm md:text-base pl-3 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="text-base md:text-lg font-light py-[8vh]">
          <span className="text-[hsl(var(--foreground))/0.86]">Quando isso é visto,</span>
          <br />
          <span className="text-[hsl(var(--foreground))/0.86]">a condução deixa de ser tentativa.</span>
          <br /><br />
          <span className="text-[#C6A96B]">E passa a ser precisão.</span>
        </Phrase>
      </section>

      <GoldButton label="Começar a ler com precisão" onClick={ctaClick} variant="solid" />
      <Spacer h="xl" />

      {/* ═══════════════════════════════
         6. SISTEMA — Humano vs Máquina
      ═══════════════════════════════ */}

      <section className="py-20 px-6 bg-[#08080C]">
        <div className="max-w-lg mx-auto">
            <Phrase className="text-[hsl(var(--primary))] text-sm uppercase tracking-[0.35em] text-center mb-10 font-semibold">
            Não é automação. É leitura viva.
          </Phrase>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="border border-[hsl(var(--border))/0.5] rounded-xl p-6 space-y-4 bg-[hsl(var(--card))/0.12]"
            >
              <p className="text-[hsl(var(--foreground))/0.8] text-xs uppercase tracking-[0.32em] font-semibold">O mercado oferece</p>
              {['Templates prontos', 'Técnicas desconectadas', 'Resultados rápidos'].map((t) => (
                <p key={t} className="text-[hsl(var(--foreground))/0.86] text-sm md:text-base flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--foreground))/0.75]" />
                  {t}
                </p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="border border-[hsl(var(--primary))/0.35] rounded-xl p-6 space-y-4 bg-[hsl(var(--primary))/0.08]"
            >
              <p className="text-[hsl(var(--primary))] text-xs uppercase tracking-[0.32em] font-semibold">A Casa Orácula entrega</p>
              {['Leitura simbólica viva', 'Método com ética e profundidade', 'Formação de identidade clínica'].map((t) => (
                <p key={t} className="text-[hsl(var(--foreground))/0.92] text-sm md:text-base flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                  {t}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <Spacer h="lg" />

      {/* ═══════════════════════════════
         7. APP — extensão da mente
      ═══════════════════════════════ */}

      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <div className="relative overflow-hidden rounded-xl mb-10">
            <img src={mentoriaImg} alt="App" loading="lazy" className="w-full h-auto object-contain" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/30 to-transparent" />
          </div>

          <Phrase className="font-display text-lg font-light text-[hsl(var(--foreground))/0.92] text-center mb-2">
            O app da Casa Orácula não é bônus.
          </Phrase>
          <Phrase className="font-display text-lg font-light text-[#C6A96B] text-center mb-8">
            É extensão da sua mente clínica.
          </Phrase>

          <div className="space-y-3">
            {['Mapa vivo da prática', 'Registro de Portas e Campos', 'Acompanhamento de narrativas', 'Supervisão integrada'].map(
              (item) => (
                <p key={item} className="text-[hsl(var(--foreground))/0.88] text-sm md:text-base flex items-center gap-3 justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))/0.75]" />
                  {item}
                </p>
              ),
            )}
          </div>
        </div>
      </section>

      <GoldButton label="Entrar na Formação" onClick={ctaClick} variant="solid" />
      <Spacer h="xl" />

      {/* ═══════════════════════════════
         8. TRANSFORMAÇÃO — Frases
      ═══════════════════════════════ */}

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light py-[10vh] text-[hsl(var(--foreground))/0.9]">
          Isso não é um curso.
        </Phrase>
        <Phrase className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light py-[10vh] text-[#C6A96B]">
          É uma formação de identidade.
        </Phrase>
        <Phrase className="font-display text-lg font-light py-[10vh] text-[hsl(var(--foreground))/0.86] leading-relaxed">
          Um ano para atravessar.
          <br />
          Integrar.
          <br />
          Se posicionar.
        </Phrase>
      </section>

      <div className="relative overflow-hidden mx-4 md:mx-auto max-w-3xl rounded-xl">
        <img src={img04} alt="Formação" loading="lazy" className="w-full h-auto object-contain" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/30 via-transparent to-[#0B0B0F]/90" />
      </div>

      <Spacer h="xl" />

      {/* ═══════════════════════════════
         9. OFERTA
      ═══════════════════════════════ */}

      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-sm mx-auto text-center"
        >
          <p className="text-[hsl(var(--primary))] text-sm uppercase tracking-[0.35em] mb-8 font-semibold">Investimento</p>
          <h2 className="font-display text-2xl font-light text-[hsl(var(--foreground))/0.96] mb-2">Formação Oracular</h2>
          <p className="text-[hsl(var(--foreground))/0.82] text-sm mb-8">Ciclo completo de 1 ano</p>

          <p className="font-display text-4xl md:text-5xl font-light text-[#F3EFE7] mb-2">
            R$ <span className="text-[#C6A96B]">3.597</span>
          </p>
          <p className="text-[hsl(var(--foreground))/0.86] text-sm mb-1">
            ou até <span className="text-[#C6A96B]/80 font-medium">12x de R$ 372,01</span>
          </p>
          <p className="text-[hsl(var(--foreground))/0.76] text-xs mb-12">Turmas fechadas</p>

          <GoldButton label="Entrar na Formação Orácula" onClick={ctaClick} variant="glow" />

          <p className="text-[hsl(var(--foreground))/0.76] text-xs mt-10 italic">
            A decisão não é sobre valor.
            <br />
            É sobre responsabilidade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════
         10. CTA FINAL — Fechamento
      ═══════════════════════════════ */}

      <section className="relative py-24 md:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-[#0E0E13] to-[#0B0B0F]" />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#C6A96B]/[0.02] blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <Phrase className="font-display text-lg font-light text-[hsl(var(--foreground))/0.88] italic mb-[8vh]">
            Depois que você aprende a ler…
            <br />
            não consegue mais fingir que não vê.
          </Phrase>
          <Phrase className="font-display text-base font-light text-[hsl(var(--foreground))/0.82] mb-[8vh]">
            Se você sente que já não quer apenas conduzir mulheres…
          </Phrase>
          <Phrase className="font-display text-lg font-light text-[#C6A96B] mb-[8vh]">
            Talvez esteja buscando uma casa.
          </Phrase>
          <Phrase className="font-display text-xl font-light text-[hsl(var(--foreground))/0.96] mb-12">
            E a Casa… já existe.
          </Phrase>

          <GoldButton label="Entrar na Formação Orácula" onClick={ctaClick} variant="glow" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[hsl(var(--border))/0.4]">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="font-display text-base md:text-lg leading-relaxed text-[hsl(var(--foreground))/0.94]">
            A Casa Orácula forma mulheres capazes de atravessar, integrar e transmitir conhecimento simbólico com ética, aplicabilidade e maturidade psíquica.
          </p>
          <p className="text-[hsl(var(--foreground))/0.72] text-[11px] leading-relaxed">
            Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
            acompanhamento psicológico ou tratamento clínico quando necessário.
          </p>
        </div>
      </footer>

      {/* ── Floating CTA mobile ── */}
      <motion.div
        initial={false}
        animate={{ y: showFloat ? 0 : 72, opacity: showFloat ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 p-3 pb-[max(12px,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/95 to-transparent md:hidden pointer-events-none"
      >
        <button
          onClick={ctaClick}
          className="w-full bg-[#C6A96B] text-[#0B0B0F] py-3.5 rounded-lg text-[10px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2 pointer-events-auto active:scale-[0.97] transition-transform"
        >
          Entrar na Formação
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
}
