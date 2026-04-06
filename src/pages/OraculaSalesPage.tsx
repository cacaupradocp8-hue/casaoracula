import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { ParticleField } from '@/components/sales/ParticleField';

import heroImg from '@/assets/formacao/imagem01.png';
import img02 from '@/assets/formacao/imagem02-new.png';
import img03 from '@/assets/formacao/imagem03-new.png';
import img04 from '@/assets/formacao/imagem04-new.png';
import mentoriaImg from '@/assets/formacao/mentoria01-new.png';
import casaTecalasImg from '@/assets/formacao/casa-tecelas-new.png';
import narroterapiaImg from '@/assets/formacao/narroterapia-new.png';

/* ── Cinematic phrase — each phrase animates on scroll ── */
function CinePhrase({
  children,
  delay = 0,
  className = '',
  accent = false,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  accent?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 35, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`${accent ? 'text-[#C6A96B]' : 'text-[#F3EFE7]/90'} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ── Full-bleed image with parallax ── */
function ParallaxImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y }}
        className="w-full h-full object-cover scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/40 via-transparent to-[#0B0B0F]" />
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width: 48, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="h-px bg-[#C6A96B]/30 mx-auto"
    />
  );
}

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const ctaClick = () => navigate('/planos');

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3EFE7] overflow-x-hidden selection:bg-[#C6A96B]/30">
      <ParticleField density={80} color="216,255,62" />

      {/* ── Header mobile ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-5 py-4"
      >
        <button
          onClick={() => navigate('/login')}
          className="text-[#F3EFE7]/50 text-[11px] tracking-[0.2em] uppercase hover:text-[#F3EFE7]/80 transition-colors"
        >
          Entrar
        </button>
      </motion.header>

      {/* ═══════════════════════════════════════════
          1. HERO — 85vh mobile-first
      ═══════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOp }}
        className="relative min-h-[85vh] flex flex-col items-center justify-center"
      >
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#0B0B0F]/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-[#0B0B0F]/30" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.7rem,7vw,3.5rem)] font-light leading-[1.2] tracking-tight mb-6"
          >
            Você não precisa
            <br />
            de mais técnica.
            <br />
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
            className="text-[#F3EFE7]/60 text-base leading-relaxed mb-10 font-light"
          >
            Aprenda a ler o campo antes de intervir.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            onClick={ctaClick}
            className="w-full max-w-xs mx-auto bg-[#C6A96B] text-[#0B0B0F] py-5 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-[#d4b87a] transition-all duration-500 flex items-center justify-center gap-2"
          >
            Entrar na Formação
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="text-[#F3EFE7]/35 text-[11px] mt-5 tracking-wide"
          >
            Ciclo de 1 ano · Turmas fechadas
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-[#F3EFE7]/20 to-transparent" />
        </motion.div>
      </motion.section>

      {/* ═══════════════════════════════════════════
          2. IDENTIFICAÇÃO — uma frase por "tela"
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-lg mx-auto space-y-[30vh]">
        {[
          'Você já estudou.',
          'Já atendeu.',
          'Já ajudou.',
          'E mesmo assim…',
          'Algo não sustenta.',
        ].map((frase, i) => (
          <CinePhrase
            key={i}
            className="font-display text-2xl md:text-4xl font-light leading-[1.3] whitespace-pre-line text-center"
            accent={i === 4}
          >
            {frase}
          </CinePhrase>
        ))}
      </section>

      {/* ── Image break ── */}
      <ParallaxImage src={img02} alt="Formação" className="h-[50vh] md:h-[60vh]" />

      {/* ═══════════════════════════════════════════
          3. PERGUNTA — QUEBRA
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-lg mx-auto text-center space-y-10">
          <CinePhrase className="font-display text-3xl md:text-5xl font-light leading-[1.15]">
            O que você ainda
            <br />
            não está vendo?
          </CinePhrase>

          <Divider />

          <CinePhrase delay={0.15} className="text-lg font-light leading-relaxed">
            A verdade desconfortável:
            <br />
            <span className="text-[#F3EFE7]/50">não é falta de ferramenta.</span>
            <br />
            <span className="text-[#C6A96B]">É falta de leitura.</span>
          </CinePhrase>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. O ERRO INVISÍVEL
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-6 max-w-lg mx-auto space-y-[22vh]">
        {[
          { text: 'O mercado ensinou você a conduzir.' },
          { text: 'Mas não ensinou a ler.' },
          { text: 'E quando você não lê…' },
          { text: 'Você interfere no tempo errado.' },
          { text: 'E toda intervenção fora de tempo…\nvira invasão simbólica.', accent: true },
        ].map((item, i) => (
          <CinePhrase
            key={i}
            accent={item.accent}
            className="font-display text-xl md:text-3xl font-light leading-[1.4] whitespace-pre-line"
          >
            {item.text}
          </CinePhrase>
        ))}
      </section>

      {/* ── Image break ── */}
      <ParallaxImage src={img03} alt="Método" className="h-[50vh] md:h-[60vh]" />

      {/* ═══════════════════════════════════════════
          5. A VIRADA
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-lg mx-auto text-center space-y-12">
          <CinePhrase className="font-display text-2xl md:text-4xl font-light">
            A Casa Orácula nasce desse ponto.
          </CinePhrase>
          <CinePhrase delay={0.1} className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/45">
            Não como método de intervenção.
          </CinePhrase>
          <CinePhrase delay={0.15} accent className="font-display text-xl md:text-2xl font-light">
            Mas como método de leitura.
          </CinePhrase>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          VSL — Vídeo
      ═══════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-[#0E0E13]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-[#C6A96B]/50 text-[10px] uppercase tracking-[0.5em] text-center mb-8">
            Assista antes de decidir
          </p>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#C6A96B]/15 shadow-[0_0_80px_-20px_rgba(198,169,107,0.15)]">
            <div className="absolute inset-0 bg-[#0B0B0F] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full border-2 border-[#C6A96B]/40 flex items-center justify-center mx-auto cursor-pointer hover:border-[#C6A96B] hover:bg-[#C6A96B]/10 transition-all duration-500">
                  <svg className="w-7 h-7 text-[#C6A96B] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-[#F3EFE7]/30 text-xs">Clique para assistir</p>
              </div>
            </div>
          </div>
          <p className="text-[#F3EFE7]/25 text-xs mt-5 text-center font-light">
            6 minutos que podem mudar a forma como você conduz.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          6. MÉTODO — Stack vertical
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-lg mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.5em] text-center mb-14"
          >
            Método da CidaDELA
          </motion.p>

          <div className="space-y-6">
            {[
              { title: 'Portas', desc: 'Em que limiar a psique está.' },
              { title: 'Campos', desc: 'O clima simbólico que pede leitura.' },
              { title: 'Torres', desc: 'O que sustentou essa mulher até aqui.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="border border-[#F3EFE7]/[0.08] p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#C6A96B]/30" />
                <h3 className="font-display text-2xl text-[#F3EFE7] font-light mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-[#F3EFE7]/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <CinePhrase delay={0.2} className="font-display text-lg font-light text-center mt-14 leading-relaxed">
            Quando isso é visto,
            <br />
            a condução deixa de ser tentativa.
            <br />
            <span className="text-[#C6A96B]">E passa a ser precisão.</span>
          </CinePhrase>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          7. NARRÔTERAPIA — com imagem
      ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        <ParallaxImage src={narroterapiaImg} alt="Narrôterapia" className="h-[45vh]" />

        <div className="py-20 px-6 max-w-lg mx-auto space-y-[20vh]">
          <CinePhrase className="font-display text-xl md:text-3xl font-light text-center">
            A Narrôterapia não corrige comportamento.
          </CinePhrase>
          <CinePhrase accent className="font-display text-xl md:text-3xl font-light text-center">
            Ela revela narrativa.
          </CinePhrase>
          <CinePhrase className="font-display text-xl md:text-3xl font-light text-center">
            Toda repetição tem uma história.
          </CinePhrase>
          <CinePhrase className="font-display text-xl md:text-3xl font-light text-center whitespace-pre-line">
            {'E toda história não vista…\nse repete.'}
          </CinePhrase>
          <CinePhrase accent className="font-display text-xl md:text-3xl font-light text-center whitespace-pre-line">
            {'Quando a narrativa é reconhecida…\na psique se reorganiza.'}
          </CinePhrase>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          8. PROVA ESTRUTURAL
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto">
          <CinePhrase className="font-display text-2xl font-light mb-10 text-center">
            Você aprende a:
          </CinePhrase>
          <div className="space-y-5">
            {[
              'Ler antes de intervir',
              'Identificar estrutura psíquica',
              'Sustentar processos reais',
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-center gap-4 py-4 border-b border-[#F3EFE7]/[0.06]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B]/60 shrink-0" />
                <p className="text-[#F3EFE7]/80 text-base font-light">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image: Mentoria ── */}
      <ParallaxImage src={mentoriaImg} alt="Mentoria" className="h-[50vh]" />

      {/* ═══════════════════════════════════════════
          ENTREGAS — com imagens
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto space-y-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.5em] text-center mb-10"
          >
            O que a formação entrega
          </motion.p>

          {[
            { title: 'Leitura simbólica', desc: 'Portas, Campos e Torres antes de intervir.', img: img04 },
            { title: 'Certificação em Narrôterapia', desc: 'Narrativa como eixo clínico simbólico.', img: narroterapiaImg },
            { title: 'Casa das Tecelãs', desc: 'Comunidade e mentorias ao vivo a cada 15 dias.', img: casaTecalasImg },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="border border-[#F3EFE7]/[0.06] overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/30 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg text-[#F3EFE7]/90 mb-2">{item.title}</h3>
                <p className="text-[#F3EFE7]/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          9. APP DIFERENCIAL
      ═══════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-[#111117]">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <CinePhrase className="font-display text-2xl font-light">
            O app da Casa Orácula não é bônus.
          </CinePhrase>
          <CinePhrase accent className="font-display text-2xl font-light">
            É extensão da sua mente clínica.
          </CinePhrase>
          <div className="space-y-3 pt-6">
            {['Mapa vivo da prática', 'Registro de Portas', 'Acompanhamento de narrativas'].map((item) => (
              <p key={item} className="text-[#F3EFE7]/50 text-sm flex items-center gap-3 justify-center">
                <span className="w-1 h-1 rounded-full bg-[#C6A96B]/50" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          10. POSICIONAMENTO FINAL
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 max-w-lg mx-auto space-y-[22vh] text-center">
        <CinePhrase className="font-display text-2xl md:text-4xl font-light">
          Isso não é um curso.
        </CinePhrase>
        <CinePhrase accent className="font-display text-2xl md:text-4xl font-light">
          É uma formação de identidade.
        </CinePhrase>
        <CinePhrase className="font-display text-xl font-light text-[#F3EFE7]/50">
          Um ano para atravessar.
          <br />
          Integrar.
          <br />
          Se posicionar.
        </CinePhrase>
      </section>

      {/* ── Image break ── */}
      <ParallaxImage src={img04} alt="Formação Orácula" className="h-[45vh]" />

      {/* ═══════════════════════════════════════════
          11. OFERTA
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-6 border-t border-[#F3EFE7]/[0.04]">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-sm mx-auto text-center"
        >
          <p className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.5em] mb-10">
            Investimento
          </p>

          <h2 className="font-display text-2xl font-light text-[#F3EFE7]/90 mb-3">
            Formação Oracular
          </h2>
          <p className="text-[#F3EFE7]/40 text-sm mb-8">Ciclo completo de 1 ano</p>

          <p className="font-display text-5xl font-light text-[#F3EFE7] mb-2">
            R$ <span className="text-[#C6A96B]">3.597</span>
          </p>
          <p className="text-[#F3EFE7]/50 text-sm mb-1">
            ou até <span className="text-[#C6A96B]/90 font-medium">12x de R$ 349,58</span>
          </p>
          <p className="text-[#F3EFE7]/30 text-xs mb-12">Turmas fechadas</p>

          <button
            onClick={ctaClick}
            className="w-full bg-[#C6A96B] text-[#0B0B0F] py-5 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-[#d4b87a] transition-all duration-500 flex items-center justify-center gap-2"
          >
            Entrar na Formação
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[#F3EFE7]/25 text-xs mt-8 leading-relaxed italic">
            A decisão não é sobre valor.
            <br />
            É sobre responsabilidade.
          </p>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          12. FECHAMENTO
      ═══════════════════════════════════════════ */}
      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-[#0E0E13] to-[#0B0B0F]" />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#C6A96B]/[0.03] blur-[140px] pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-lg mx-auto space-y-10 text-center">
          <CinePhrase className="font-display text-xl font-light text-[#F3EFE7]/55 italic">
            Depois que você aprende a ler…
            <br />
            não consegue mais fingir que não vê.
          </CinePhrase>
          <CinePhrase className="font-display text-lg font-light text-[#F3EFE7]/40">
            Se você sente que já não quer apenas conduzir mulheres…
          </CinePhrase>
          <CinePhrase accent className="font-display text-xl font-light">
            Talvez esteja buscando uma casa.
          </CinePhrase>
          <CinePhrase className="font-display text-2xl font-light">
            E a Casa… já existe.
          </CinePhrase>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="pt-6"
          >
            <button
              onClick={ctaClick}
              className="w-full max-w-xs mx-auto bg-[#C6A96B] text-[#0B0B0F] py-6 text-[11px] uppercase tracking-[0.3em] font-semibold hover:bg-[#d4b87a] transition-all duration-700 shadow-[0_0_100px_-20px_rgba(198,169,107,0.3)] flex items-center justify-center gap-2"
            >
              Entrar na Formação Orácula
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 px-6 border-t border-[#F3EFE7]/[0.03]">
        <p className="text-[#F3EFE7]/15 text-[11px] leading-relaxed max-w-sm">
          Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
          acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </footer>

      {/* ═══ CTA FLUTUANTE MOBILE ═══ */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 3 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/95 to-transparent md:hidden"
      >
        <button
          onClick={ctaClick}
          className="w-full bg-[#C6A96B] text-[#0B0B0F] py-4 text-[11px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2 shadow-[0_-4px_30px_rgba(198,169,107,0.2)]"
        >
          Entrar na Formação
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
