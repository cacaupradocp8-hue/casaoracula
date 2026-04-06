import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { ParticleField } from '@/components/sales/ParticleField';

import heroImg from '@/assets/formacao/imagem01.png';
import img02 from '@/assets/formacao/imagem02-new.png';
import img03 from '@/assets/formacao/imagem03-new.png';
import img04 from '@/assets/formacao/imagem04-new.png';
import mentoriaImg from '@/assets/formacao/mentoria01-new.png';
import casaTecalasImg from '@/assets/formacao/casa-tecelas-new.png';
import narroterapiaImg from '@/assets/formacao/narroterapia-new.png';

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
  const inView = useInView(ref, { once: true, margin: '-18% 0px -18% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ImpactScreen({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-6">
      <Phrase className={`text-center max-w-lg mx-auto ${className}`}>{children}</Phrase>
    </section>
  );
}

function Breath({ height = 'h-[100px] md:h-[140px]' }: { height?: string }) {
  return <div className={height} />;
}

function ParallaxImage({
  src,
  alt,
  className = '',
  imgClassName = 'object-center scale-[1.08] md:scale-[1.12]',
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y }} className={`w-full h-full object-cover ${imgClassName}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/50 via-transparent to-[#0B0B0F]" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0B0B0F]/35 to-transparent" />
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
    cool: 'border border-[#C6A96B]/40 bg-transparent text-[#F3EFE7]/80 hover:bg-[#C6A96B]/10 hover:border-[#C6A96B]/60',
    warm: 'bg-[#C6A96B] text-[#0B0B0F] hover:bg-[#d4b87a]',
    hot: 'bg-[#C6A96B] text-[#0B0B0F] hover:bg-[#d4b87a] shadow-[0_0_100px_-15px_rgba(198,169,107,0.35)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="flex justify-center"
    >
      <button
        onClick={onClick}
        className={`w-full max-w-xs py-5 text-[11px] uppercase tracking-[0.3em] font-semibold transition-all duration-500 flex items-center justify-center gap-2 ${styles[temperature]}`}
      >
        {label}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export default function OraculaSalesPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const heroOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const ctaClick = () => navigate('/planos');

  const [showFloating, setShowFloating] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setShowFloating(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F3EFE7] overflow-x-hidden selection:bg-[#C6A96B]/30">
      <ParticleField density={80} color="216,255,62" />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-end px-5 py-4"
      >
        <button
          onClick={() => navigate('/login')}
          className="text-[#F3EFE7]/40 text-[11px] tracking-[0.2em] uppercase hover:text-[#F3EFE7]/70 transition-colors"
        >
          Entrar
        </button>
      </motion.header>

      <motion.section
        ref={heroRef}
        style={{ opacity: heroOp }}
        className="relative min-h-[90vh] flex flex-col items-center justify-center"
      >
        <motion.div className="absolute inset-0 z-0" style={{ scale: heroScale }}>
          <img src={heroImg} alt="" className="w-full h-full object-cover object-[center_18%] md:object-center" />
          <div className="absolute inset-0 bg-[#0B0B0F]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-[#0B0B0F]/20" />
        </motion.div>

        <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(1.6rem,7vw,3.2rem)] font-light leading-[1.25] tracking-tight mb-8"
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
            transition={{ duration: 1, delay: 1.4 }}
            className="text-[#F3EFE7]/55 text-base leading-relaxed mb-12 font-light"
          >
            Aprenda a ler o campo antes de intervir.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <CTA label="Entrar na Formação" onClick={ctaClick} temperature="cool" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="text-[#F3EFE7]/25 text-[11px] mt-6 tracking-wide"
          >
            Ciclo de 1 ano · Turmas fechadas
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#F3EFE7]/15 to-transparent" />
        </motion.div>
      </motion.section>

      <section className="px-6 max-w-lg mx-auto">
        <Breath />
        {['Você já estudou.', 'Já atendeu.', 'Já ajudou.'].map((frase, i) => (
          <div key={i}>
            <Phrase
              delay={i * 0.05}
              className="font-display text-[clamp(1.3rem,5vw,2.2rem)] font-light leading-[1.3] text-center text-[#F3EFE7]/80 py-[12vh] md:py-[15vh]"
            >
              {frase}
            </Phrase>
          </div>
        ))}
      </section>

      <ImpactScreen className="font-display text-[clamp(1.5rem,6vw,2.8rem)] font-light leading-[1.2]">
        <span className="text-[#F3EFE7]/60">E mesmo assim…</span>
        <br />
        <br />
        <span className="text-[#C6A96B]">Algo não sustenta.</span>
      </ImpactScreen>

      <Breath />

      <ParallaxImage
        src={img02}
        alt="Formação Orácula"
        className="h-[48vh] md:h-[55vh]"
        imgClassName="object-center scale-[1.08] md:scale-[1.12]"
      />

      <Breath />

      <ImpactScreen className="font-display text-[clamp(1.6rem,6.5vw,3rem)] font-light leading-[1.15]">
        O que você ainda
        <br />
        não está vendo?
      </ImpactScreen>

      <ImpactScreen className="text-lg md:text-xl font-light leading-relaxed">
        <span className="text-[#F3EFE7]/50">A verdade desconfortável:</span>
        <br />
        <br />
        <span className="text-[#F3EFE7]/40">não é falta de ferramenta.</span>
        <br />
        <br />
        <span className="text-[#C6A96B]">É falta de leitura.</span>
      </ImpactScreen>

      <section className="px-6 max-w-lg mx-auto">
        {[
          { text: 'O mercado ensinou você a conduzir.', dim: true },
          { text: 'Mas não ensinou a ler.', dim: true },
          { text: 'E quando você não lê…', dim: true },
          { text: 'Você interfere no tempo errado.', dim: false },
        ].map((item, i) => (
          <Phrase
            key={i}
            className={`font-display text-xl md:text-2xl font-light leading-[1.4] py-[13vh] md:py-[16vh] ${
              item.dim ? 'text-[#F3EFE7]/50' : 'text-[#F3EFE7]/85'
            }`}
          >
            {item.text}
          </Phrase>
        ))}
      </section>

      <ImpactScreen className="font-display text-[clamp(1.4rem,5.5vw,2.5rem)] font-light leading-[1.3]">
        <span className="text-[#F3EFE7]/60">E toda intervenção fora de tempo…</span>
        <br />
        <br />
        <span className="text-[#C6A96B]">vira invasão simbólica.</span>
      </ImpactScreen>

      <Breath height="h-[60px] md:h-[80px]" />
      <CTA label="Começar a ler com precisão" onClick={ctaClick} temperature="warm" />
      <Breath />

      <ParallaxImage
        src={img03}
        alt="Leitura simbólica"
        className="h-[58vh] md:h-[60vh]"
        imgClassName="object-[center_16%] md:object-center scale-[1.02] md:scale-[1.06]"
      />

      <ImpactScreen className="font-display text-[clamp(1.5rem,6vw,2.8rem)] font-light leading-[1.2]">
        A Casa Orácula nasce desse ponto.
      </ImpactScreen>

      <section className="px-6 max-w-lg mx-auto text-center space-y-[12vh]">
        <Phrase className="font-display text-xl md:text-2xl font-light text-[#F3EFE7]/40">
          Não como método de intervenção.
        </Phrase>
        <Phrase className="font-display text-xl md:text-2xl font-light text-[#C6A96B]">
          Mas como método de leitura.
        </Phrase>
      </section>

      <Breath />

      <section className="py-16 px-6 bg-[#0A0A0E]">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-[#C6A96B]/40 text-[10px] uppercase tracking-[0.5em] text-center mb-8">
            Assista antes de decidir
          </p>
          <div className="relative aspect-video rounded-lg overflow-hidden border border-[#C6A96B]/12 shadow-[0_0_60px_-20px_rgba(198,169,107,0.12)]">
            <div className="absolute inset-0 bg-[#0B0B0F] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full border-2 border-[#C6A96B]/30 flex items-center justify-center mx-auto cursor-pointer hover:border-[#C6A96B] hover:bg-[#C6A96B]/10 transition-all duration-500">
                  <svg className="w-7 h-7 text-[#C6A96B] ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-[#F3EFE7]/25 text-xs">Clique para assistir</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <Breath />

      <ParallaxImage
        src={narroterapiaImg}
        alt="Narrôterapia"
        className="h-[42vh] md:h-[44vh]"
        imgClassName="object-center scale-[1.08] md:scale-[1.12]"
      />

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
            className={`font-display text-xl md:text-2xl font-light leading-[1.4] whitespace-pre-line text-center py-[14vh] md:py-[17vh] ${
              item.accent ? 'text-[#C6A96B]' : 'text-[#F3EFE7]/60'
            }`}
          >
            {item.text}
          </Phrase>
        ))}
      </section>

      <Breath />

      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto">
          <Phrase className="text-[#C6A96B]/35 text-[10px] uppercase tracking-[0.5em] text-center mb-16">
            Método da CidaDELA
          </Phrase>

          <div className="space-y-8">
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
                transition={{ duration: 0.9, delay: i * 0.15 }}
                className="border border-[#F3EFE7]/[0.06] p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-[3px] h-full bg-[#C6A96B]/25" />
                <h3 className="font-display text-2xl text-[#F3EFE7]/90 font-light mb-2 tracking-wide pl-2">
                  {item.title}
                </h3>
                <p className="text-[#F3EFE7]/40 text-sm leading-relaxed pl-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ImpactScreen className="font-display text-lg md:text-xl font-light leading-relaxed">
        <span className="text-[#F3EFE7]/50">Quando isso é visto,</span>
        <br />
        <span className="text-[#F3EFE7]/50">a condução deixa de ser tentativa.</span>
        <br />
        <br />
        <span className="text-[#C6A96B]">E passa a ser precisão.</span>
      </ImpactScreen>

      <section className="py-16 px-6">
        <div className="max-w-lg mx-auto">
          <Phrase className="font-display text-xl font-light mb-10 text-center text-[#F3EFE7]/70">
            Você aprende a:
          </Phrase>
          <div className="space-y-5">
            {['Ler antes de intervir', 'Identificar estrutura psíquica', 'Sustentar processos reais'].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-center gap-4 py-4 border-b border-[#F3EFE7]/[0.05]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A96B]/50 shrink-0" />
                <p className="text-[#F3EFE7]/70 text-base font-light">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Breath height="h-[60px] md:h-[80px]" />
      <CTA label="Começar a ler com precisão" onClick={ctaClick} temperature="warm" />
      <Breath />

      <ParallaxImage
        src={mentoriaImg}
        alt="Mentoria"
        className="h-[46vh] md:h-[48vh]"
        imgClassName="object-center scale-[1.06] md:scale-[1.1]"
      />

      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto space-y-8">
          <Phrase className="text-[#C6A96B]/35 text-[10px] uppercase tracking-[0.5em] text-center mb-8">
            O que a formação entrega
          </Phrase>

          {[
            {
              title: 'Leitura simbólica',
              desc: 'Portas, Campos e Torres antes de intervir.',
              img: img04,
              mediaClass: 'aspect-[4/5]',
              imageClass: 'object-[center_16%]',
            },
            {
              title: 'Certificação em Narrôterapia',
              desc: 'Narrativa como eixo clínico simbólico.',
              img: narroterapiaImg,
              mediaClass: 'aspect-[16/10]',
              imageClass: 'object-center',
            },
            {
              title: 'Casa das Tecelãs',
              desc: 'Comunidade e mentorias ao vivo a cada 15 dias.',
              img: casaTecalasImg,
              mediaClass: 'aspect-[16/10]',
              imageClass: 'object-center',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="border border-[#F3EFE7]/[0.05] overflow-hidden"
            >
              <div className={`relative overflow-hidden ${item.mediaClass}`}>
                <img src={item.img} alt={item.title} className={`w-full h-full object-cover ${item.imageClass}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/20 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg text-[#F3EFE7]/85 mb-1.5">{item.title}</h3>
                <p className="text-[#F3EFE7]/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0A0A0E]">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <Phrase className="font-display text-xl font-light text-[#F3EFE7]/80">
            O app da Casa Orácula não é bônus.
          </Phrase>
          <Phrase className="font-display text-xl font-light text-[#C6A96B]">
            É extensão da sua mente clínica.
          </Phrase>
          <div className="space-y-3 pt-4">
            {['Mapa vivo da prática', 'Registro de Portas', 'Acompanhamento de narrativas'].map((item) => (
              <p key={item} className="text-[#F3EFE7]/40 text-sm flex items-center gap-3 justify-center">
                <span className="w-1 h-1 rounded-full bg-[#C6A96B]/40" />
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Breath />

      <section className="px-6 max-w-lg mx-auto">
        <Phrase className="font-display text-[clamp(1.4rem,5.5vw,2.5rem)] font-light text-center py-[15vh] text-[#F3EFE7]/80">
          Isso não é um curso.
        </Phrase>
        <Phrase className="font-display text-[clamp(1.4rem,5.5vw,2.5rem)] font-light text-center py-[15vh] text-[#C6A96B]">
          É uma formação de identidade.
        </Phrase>
        <Phrase className="font-display text-xl font-light text-center py-[15vh] text-[#F3EFE7]/45">
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
        className="h-[58vh] md:h-[52vh]"
        imgClassName="object-[center_14%] md:object-center scale-[1.01] md:scale-[1.05]"
      />

      <Breath />

      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          className="max-w-sm mx-auto text-center"
        >
          <p className="text-[#C6A96B]/30 text-[10px] uppercase tracking-[0.5em] mb-10">
            Investimento
          </p>

          <h2 className="font-display text-2xl font-light text-[#F3EFE7]/85 mb-3">Formação Oracular</h2>
          <p className="text-[#F3EFE7]/35 text-sm mb-8">Ciclo completo de 1 ano</p>

          <p className="font-display text-5xl font-light text-[#F3EFE7] mb-2">
            R$ <span className="text-[#C6A96B]">3.597</span>
          </p>
          <p className="text-[#F3EFE7]/45 text-sm mb-1">
            ou até <span className="text-[#C6A96B]/80 font-medium">12x de R$ 349,58</span>
          </p>
          <p className="text-[#F3EFE7]/25 text-xs mb-14">Turmas fechadas</p>

          <CTA label="Entrar na Formação Orácula" onClick={ctaClick} temperature="hot" />

          <p className="text-[#F3EFE7]/20 text-xs mt-10 leading-relaxed italic">
            A decisão não é sobre valor.
            <br />
            É sobre responsabilidade.
          </p>
        </motion.div>
      </section>

      <section className="relative py-28 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F] via-[#0E0E13] to-[#0B0B0F]" />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#C6A96B]/[0.025] blur-[120px] pointer-events-none"
          animate={{ scale: [1, 1.12, 1], opacity: [0.12, 0.3, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-lg mx-auto text-center">
          <Phrase className="font-display text-xl font-light text-[#F3EFE7]/45 italic mb-[10vh]">
            Depois que você aprende a ler…
            <br />
            não consegue mais fingir que não vê.
          </Phrase>
          <Phrase className="font-display text-lg font-light text-[#F3EFE7]/35 mb-[10vh]">
            Se você sente que já não quer apenas conduzir mulheres…
          </Phrase>
          <Phrase className="font-display text-xl font-light text-[#C6A96B] mb-[10vh]">
            Talvez esteja buscando uma casa.
          </Phrase>
          <Phrase className="font-display text-2xl font-light text-[#F3EFE7]/85 mb-12">
            E a Casa… já existe.
          </Phrase>

          <CTA label="Entrar na Formação Orácula" onClick={ctaClick} temperature="hot" />
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-[#F3EFE7]/[0.03]">
        <p className="text-[#F3EFE7]/12 text-[11px] leading-relaxed max-w-sm">
          Casa Orácula © {new Date().getFullYear()} · A Casa Orácula não substitui terapia,
          acompanhamento psicológico ou tratamento clínico quando necessário.
        </p>
      </footer>

      {showFloating && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/90 to-transparent md:hidden pb-safe"
        >
          <button
            onClick={ctaClick}
            className="w-full bg-[#C6A96B]/90 text-[#0B0B0F] py-3.5 text-[10px] uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2"
          >
            Entrar na Formação
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
