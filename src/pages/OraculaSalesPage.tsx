import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { ParticleField } from '@/components/sales/ParticleField';

import heroImg from '@/assets/formacao/imagem01.png';
import img02 from '@/assets/formacao/imagem02-new.png';
import img03 from '@/assets/formacao/imagem03-new.png';
import img04 from '@/assets/formacao/imagem04-new.png';
import mentoriaImg from '@/assets/formacao/mentoria01-new.png';
import casaTecalasImg from '@/assets/formacao/casa-tecelas-new.png';
import narroterapiaImg from '@/assets/formacao/narroterapia-new.png';

/* ─────────────────────────────────────────────
   COLORS (centralized)
───────────────────────────────────────────── */
const C = {
  bg: '#0B0B0F',
  bgAlt: '#0A0A0E',
  text: '#F3EFE7',
  gold: '#C6A96B',
  goldHover: '#d4b87a',
} as const;

/* ─────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────── */

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
  const inView = useInView(ref, { once: true, margin: '-12% 0px -12% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: 'blur(5px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Breath({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const heights = {
    sm: 'h-12 md:h-16',
    md: 'h-16 md:h-24',
    lg: 'h-24 md:h-36',
    xl: 'h-32 md:h-48',
  };
  return <div className={heights[size]} aria-hidden />;
}

function ParallaxImage({
  src,
  alt,
  className = '',
  imgClassName = 'object-center',
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div ref={ref} className={`relative overflow-hidden mx-4 md:mx-0 rounded-lg md:rounded-xl ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y }}
        className={`w-full h-full object-cover scale-[1.06] ${imgClassName}`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/40 via-transparent to-[#0B0B0F]/90" />
    </div>
  );
}

function CTA({
  label,
  onClick,
  temperature = 'warm',
}: {
  label: string;
  onClick: () => void;
  temperature?: 'cool' | 'warm' | 'hot';
}) {
  const styles = {
    cool: `border border-[${C.gold}]/30 bg-transparent text-[${C.text}]/70 hover:bg-[${C.gold}]/10 hover:border-[${C.gold}]/50`,
    warm: `bg-[${C.gold}] text-[${C.bg}] hover:bg-[${C.goldHover}]`,
    hot: `bg-[${C.gold}] text-[${C.bg}] hover:bg-[${C.goldHover}] shadow-[0_0_80px_-15px_rgba(198,169,107,0.35)]`,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="flex justify-center px-4"
    >
      <button
        onClick={onClick}
        className={`w-full max-w-sm py-4 md:py-5 rounded-lg text-[11px] uppercase tracking-[0.25em] font-semibold transition-all duration-500 flex items-center justify-center gap-2 active:scale-[0.97] ${styles[temperature]}`}
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/** Premium video container with custom play button */
function PremiumVideoContainer({ onCtaClick }: { onCtaClick: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.6 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="relative rounded-2xl overflow-hidden border border-[#C6A96B]/15 bg-[#0B0B0F] shadow-[0_8px_60px_-12px_rgba(198,169,107,0.12)]">
        {/* Subtle glow behind */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#C6A96B]/[0.06] via-transparent to-[#C6A96B]/[0.03] blur-sm pointer-events-none" />

        <div className="relative aspect-video">
          {!isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0B0B0F]">
              {/* Placeholder image / thumbnail */}
              <img
                src={heroImg}
                alt="Assistir VSL"
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/60 to-[#0B0B0F]/40" />

              {/* Play button */}
              <button
                onClick={() => setIsPlaying(true)}
                className="relative z-10 group flex flex-col items-center gap-4"
                aria-label="Reproduzir vídeo"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-[#C6A96B]/40 flex items-center justify-center bg-[#C6A96B]/5 backdrop-blur-sm group-hover:border-[#C6A96B] group-hover:bg-[#C6A96B]/15 group-hover:scale-105 transition-all duration-500">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-[#C6A96B] ml-1 group-hover:text-[#C6A96B]" fill="currentColor" />
                </div>
                <span className="text-[#F3EFE7]/30 text-xs tracking-wider uppercase">
                  Assistir apresentação
                </span>
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-[#0B0B0F] flex items-center justify-center">
              <p className="text-[#F3EFE7]/30 text-sm">Vídeo em breve</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA right below video */}
      <div className="mt-6">
        <CTA label="Entrar na Formação" onClick={onCtaClick} temperature="cool" />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOp = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const ctaClick = useCallback(
    () => window.open('https://pay.rockty.com/inn1jdxprkw4gafeubsdww?off=qqqmfhyjku7ou9kc70gg', '_blank'),
    []
  );

  /* Floating CTA — appears after scrolling past hero */
  const [showFloating, setShowFloating] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowFloating(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3EFE7] overflow-x-hidden selection:bg-[#C6A96B]/30">
      <ParticleField density={40} color="216,255,62" />

      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4"
      >
        <span className="text-[#F3EFE7]/20 text-[10px] tracking-[0.3em] uppercase font-medium">
          Casa Orácula
        </span>
        <button
          onClick={() => navigate('/login')}
          className="text-[#F3EFE7]/40 text-[11px] tracking-[0.2em] uppercase hover:text-[#F3EFE7]/70 transition-colors"
        >
          Entrar
        </button>
      </motion.header>

      {/* ══════════════════════════════════════════
         1. HERO — Headline + Vídeo + CTA
      ══════════════════════════════════════════ */}

      <motion.section
        ref={heroRef}
        style={{ opacity: heroOp }}
        className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12"
      >
        {/* Background image */}
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <img
            src={heroImg}
            alt=""
            className="w-full h-full object-cover object-[center_18%] md:object-center"
          />
          <div className="absolute inset-0 bg-[#0B0B0F]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/30 to-[#0B0B0F]/30" />
        </motion.div>

        <div className="relative z-10 w-full flex flex-col items-center gap-8 md:gap-10">
          {/* Headline */}
          <div className="text-center px-6 max-w-lg mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[clamp(1.5rem,6.5vw,3rem)] font-light leading-[1.2] tracking-tight mb-4"
            >
              Você não precisa
              <br />
              de mais técnica.
              <br />
              <span className="text-[#C6A96B]">
                Precisa parar
                <br />
                de conduzir no escuro.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="text-[#F3EFE7]/45 text-base md:text-lg leading-relaxed font-light"
            >
              Aprenda a ler o campo antes de intervir.
            </motion.p>
          </div>

          {/* Video — premium container */}
          <PremiumVideoContainer onCtaClick={ctaClick} />

          {/* Micro copy */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-[#F3EFE7]/20 text-[11px] tracking-wide text-center"
          >
            Ciclo de 1 ano · Turmas fechadas
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-[#F3EFE7]/15 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ══════════════════════════════════════════
         2. RECONHECIMENTO — Dor
      ══════════════════════════════════════════ */}

      <section className="px-6 max-w-lg mx-auto">
        <Breath size="lg" />
        {['Você já estudou.', 'Já atendeu.', 'Já ajudou.'].map((frase, i) => (
          <Phrase
            key={i}
            delay={i * 0.04}
            className="font-display text-[clamp(1.2rem,5vw,2rem)] font-light leading-[1.3] text-center text-[#F3EFE7]/70 py-[12vh] md:py-[14vh]"
          >
            {frase}
          </Phrase>
        ))}
      </section>

      {/* ══════════════════════════════════════════
         3. DESCONFORTO — Diagnóstico
      ══════════════════════════════════════════ */}

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="font-display text-[clamp(1.4rem,6vw,2.6rem)] font-light leading-[1.2] py-[14vh]">
          <span className="text-[#F3EFE7]/50">E mesmo assim…</span>
          <br /><br />
          <span className="text-[#C6A96B]">Algo não sustenta.</span>
        </Phrase>
      </section>

      <Breath size="md" />

      <ParallaxImage
        src={img02}
        alt="Formação Orácula"
        className="h-[45vh] md:h-[55vh] max-w-3xl mx-auto"
      />

      <Breath size="lg" />

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="font-display text-[clamp(1.4rem,6vw,2.6rem)] font-light leading-[1.2] py-[12vh]">
          O que você ainda
          <br />
          não está vendo?
        </Phrase>

        <Phrase className="text-base md:text-lg font-light leading-relaxed py-[12vh]">
          <span className="text-[#F3EFE7]/40">A verdade desconfortável:</span>
          <br /><br />
          <span className="text-[#F3EFE7]/30">não é falta de ferramenta.</span>
          <br /><br />
          <span className="text-[#C6A96B]">É falta de leitura.</span>
        </Phrase>
      </section>

      <section className="px-6 max-w-lg mx-auto">
        {[
          { text: 'O mercado ensinou você a conduzir.', dim: true },
          { text: 'Mas não ensinou a ler.', dim: true },
          { text: 'E quando você não lê…', dim: true },
          { text: 'Você interfere no tempo errado.', dim: false },
        ].map((item, i) => (
          <Phrase
            key={i}
            className={`font-display text-lg md:text-xl font-light leading-[1.4] text-center py-[12vh] md:py-[14vh] ${
              item.dim ? 'text-[#F3EFE7]/40' : 'text-[#F3EFE7]/80'
            }`}
          >
            {item.text}
          </Phrase>
        ))}
      </section>

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light leading-[1.3] py-[12vh]">
          <span className="text-[#F3EFE7]/50">E toda intervenção fora de tempo…</span>
          <br /><br />
          <span className="text-[#C6A96B]">vira invasão simbólica.</span>
        </Phrase>
      </section>

      {/* CTA 1 */}
      <CTA label="Entrar na Formação" onClick={ctaClick} temperature="cool" />
      <Breath size="xl" />

      {/* ══════════════════════════════════════════
         4. REVELAÇÃO
      ══════════════════════════════════════════ */}

      <ParallaxImage
        src={img03}
        alt="Leitura simbólica"
        className="h-[50vh] md:h-[58vh] max-w-3xl mx-auto"
        imgClassName="object-[center_16%] md:object-center"
      />

      <Breath size="lg" />

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="font-display text-[clamp(1.4rem,6vw,2.6rem)] font-light leading-[1.2] py-[12vh]">
          A Casa Orácula nasce desse ponto.
        </Phrase>

        <Phrase className="font-display text-lg md:text-xl font-light text-[#F3EFE7]/30 py-[10vh]">
          Não como método de intervenção.
        </Phrase>
        <Phrase className="font-display text-lg md:text-xl font-light text-[#C6A96B] py-[10vh]">
          Mas como método de leitura.
        </Phrase>
      </section>

      <Breath size="lg" />

      <ParallaxImage
        src={narroterapiaImg}
        alt="Narrôterapia"
        className="h-[40vh] md:h-[46vh] max-w-3xl mx-auto"
      />

      <Breath size="md" />

      <section className="px-6 max-w-lg mx-auto">
        {[
          { text: 'A Narrôterapia não corrige comportamento.', accent: false },
          { text: 'Ela revela narrativa.', accent: true },
          { text: 'Toda repetição tem uma história.', accent: false },
          { text: 'E toda história não vista…\nse repete.', accent: false },
          { text: 'Quando a narrativa é reconhecida…\na psique se reorganiza.', accent: true },
        ].map((item, i) => (
          <Phrase
            key={i}
            className={`font-display text-lg md:text-xl font-light leading-[1.4] whitespace-pre-line text-center py-[12vh] md:py-[14vh] ${
              item.accent ? 'text-[#C6A96B]' : 'text-[#F3EFE7]/50'
            }`}
          >
            {item.text}
          </Phrase>
        ))}
      </section>

      {/* ══════════════════════════════════════════
         5. MÉTODO
      ══════════════════════════════════════════ */}

      <Breath size="lg" />

      {/* Método da CidaDELA */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-lg mx-auto">
          <Phrase className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] text-center mb-12">
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
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12 }}
                className="border border-[#F3EFE7]/[0.06] rounded-lg p-6 md:p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-[3px] h-full bg-[#C6A96B]/25 rounded-full" />
                <h3 className="font-display text-xl text-[#F3EFE7]/80 font-light mb-1.5 pl-3">
                  {item.title}
                </h3>
                <p className="text-[#F3EFE7]/35 text-sm leading-relaxed pl-3">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="text-base md:text-lg font-light leading-relaxed py-[10vh]">
          <span className="text-[#F3EFE7]/40">Quando isso é visto,</span>
          <br />
          <span className="text-[#F3EFE7]/40">a condução deixa de ser tentativa.</span>
          <br /><br />
          <span className="text-[#C6A96B]">E passa a ser precisão.</span>
        </Phrase>
      </section>

      {/* O que aprende */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-lg mx-auto">
          <Phrase className="font-display text-lg font-light mb-8 text-center text-[#F3EFE7]/60">
            Você aprende a:
          </Phrase>
          <div className="space-y-4">
            {['Ler antes de intervir', 'Identificar estrutura psíquica', 'Sustentar processos reais'].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4 py-4 border-b border-[#F3EFE7]/[0.05]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B]/40 shrink-0" />
                <p className="text-[#F3EFE7]/60 text-base font-light">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 2 */}
      <Breath size="md" />
      <CTA label="Começar a ler com precisão" onClick={ctaClick} temperature="warm" />
      <Breath size="xl" />

      {/* ══════════════════════════════════════════
         6. ESTRUTURA — O que a formação entrega
      ══════════════════════════════════════════ */}

      <ParallaxImage
        src={mentoriaImg}
        alt="Mentoria"
        className="h-[44vh] md:h-[50vh] max-w-3xl mx-auto"
      />

      <section className="py-16 px-4 md:px-6">
        <div className="max-w-lg mx-auto space-y-6">
          <Phrase className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] text-center mb-8">
            O que a formação entrega
          </Phrase>

          {[
            {
              title: 'Leitura simbólica',
              desc: 'Portas, Campos e Torres antes de intervir.',
              img: img04,
              ratio: 'aspect-[4/5]',
              imgPos: 'object-[center_16%]',
            },
            {
              title: 'Certificação em Narrôterapia',
              desc: 'Narrativa como eixo clínico simbólico.',
              img: narroterapiaImg,
              ratio: 'aspect-[16/10]',
              imgPos: 'object-center',
            },
            {
              title: 'Casa das Tecelãs',
              desc: 'Comunidade e mentorias ao vivo a cada 15 dias.',
              img: casaTecalasImg,
              ratio: 'aspect-[16/10]',
              imgPos: 'object-center',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="border border-[#F3EFE7]/[0.05] rounded-xl overflow-hidden"
            >
              <div className={`relative overflow-hidden ${item.ratio}`}>
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  className={`w-full h-full object-cover ${item.imgPos}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/20 to-transparent" />
              </div>
              <div className="p-5 md:p-7">
                <h3 className="font-display text-lg text-[#F3EFE7]/80 mb-1">{item.title}</h3>
                <p className="text-[#F3EFE7]/35 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* App */}
      <section className="py-16 px-4 md:px-6 bg-[#0A0A0E]">
        <div className="max-w-lg mx-auto text-center space-y-5">
          <Phrase className="font-display text-lg font-light text-[#F3EFE7]/70">
            O app da Casa Orácula não é bônus.
          </Phrase>
          <Phrase className="font-display text-lg font-light text-[#C6A96B]">
            É extensão da sua mente clínica.
          </Phrase>
          <div className="space-y-2.5 pt-4">
            {['Mapa vivo da prática', 'Registro de Portas', 'Acompanhamento de narrativas'].map((item) => (
              <p key={item} className="text-[#F3EFE7]/35 text-sm flex items-center gap-3 justify-center">
                <span className="w-1 h-1 rounded-full bg-[#C6A96B]/35" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 3 */}
      <Breath size="lg" />
      <CTA label="Entrar na Formação" onClick={ctaClick} temperature="warm" />

      {/* ══════════════════════════════════════════
         7. DECISÃO
      ══════════════════════════════════════════ */}

      <Breath size="xl" />

      <section className="px-6 max-w-lg mx-auto text-center">
        <Phrase className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light py-[12vh] text-[#F3EFE7]/70">
          Isso não é um curso.
        </Phrase>
        <Phrase className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light py-[12vh] text-[#C6A96B]">
          É uma formação de identidade.
        </Phrase>
        <Phrase className="font-display text-lg font-light py-[12vh] text-[#F3EFE7]/40">
          Um ano para atravessar.
          <br />
          Integrar.
          <br />
          Se posicionar.
        </Phrase>
      </section>

      <ParallaxImage
        src={img04}
        alt="Formação Oracular"
        className="h-[50vh] md:h-[52vh] max-w-3xl mx-auto"
        imgClassName="object-[center_14%] md:object-center"
      />

      <Breath size="xl" />

      {/* ── Oferta final ── */}
      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(3px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-sm mx-auto text-center"
        >
          <p className="text-[#C6A96B]/25 text-[10px] uppercase tracking-[0.5em] mb-10">
            Investimento
          </p>

          <h2 className="font-display text-2xl font-light text-[#F3EFE7]/80 mb-2">Formação Oracular</h2>
          <p className="text-[#F3EFE7]/30 text-sm mb-8">Ciclo completo de 1 ano</p>

          <p className="font-display text-4xl md:text-5xl font-light text-[#F3EFE7] mb-2">
            R$ <span className="text-[#C6A96B]">3.597</span>
          </p>
          <p className="text-[#F3EFE7]/40 text-sm mb-1">
            ou até <span className="text-[#C6A96B]/80 font-medium">12x de R$ 372,01</span>
          </p>
          <p className="text-[#F3EFE7]/20 text-xs mb-12">Turmas fechadas</p>

          <CTA label="Entrar na Formação Orácula" onClick={ctaClick} temperature="hot" />

          <p className="text-[#F3EFE7]/15 text-xs mt-10 leading-relaxed italic">
            A decisão não é sobre valor.
            <br />
            É sobre responsabilidade.
          </p>
        </motion.div>
      </section>

      {/* Fechamento emocional */}
      <section className="relative py-24 md:py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-[#0E0E13] to-[#0B0B0F]" />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#C6A96B]/[0.02] blur-[100px] pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <Phrase className="font-display text-lg font-light text-[#F3EFE7]/40 italic mb-[10vh]">
            Depois que você aprende a ler…
            <br />
            não consegue mais fingir que não vê.
          </Phrase>
          <Phrase className="font-display text-base font-light text-[#F3EFE7]/30 mb-[10vh]">
            Se você sente que já não quer apenas conduzir mulheres…
          </Phrase>
          <Phrase className="font-display text-lg font-light text-[#C6A96B] mb-[10vh]">
            Talvez esteja buscando uma casa.
          </Phrase>
          <Phrase className="font-display text-xl font-light text-[#F3EFE7]/75 mb-12">
            E a Casa… já existe.
          </Phrase>

          <CTA label="Entrar na Formação Orácula" onClick={ctaClick} temperature="hot" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-[#F3EFE7]/[0.04]">
        <p className="text-[#F3EFE7]/10 text-[11px] leading-relaxed max-w-sm mx-auto text-center">
          Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
          acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </footer>

      {/* ── Floating CTA — mobile, scroll-aware ── */}
      <motion.div
        initial={false}
        animate={{ y: showFloating ? 0 : 72, opacity: showFloating ? 1 : 0 }}
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
